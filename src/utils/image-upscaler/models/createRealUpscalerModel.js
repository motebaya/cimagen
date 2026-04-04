import { sourceToCanvas } from "../../canvasUtils.js";
import {
  applyAdaptiveEnhance,
  applyColorFinish,
  applyNoiseReduction,
} from "../canvasUpscale.js";
import { clamp, ensureTensorflowBackend } from "../imageUpscalerHelpers.js";

let UpscalerConstructorPromise = null;

async function getUpscalerConstructor() {
  if (!UpscalerConstructorPromise) {
    UpscalerConstructorPromise = import("upscaler").then(
      (module) => module.default || module,
    );
  }

  return UpscalerConstructorPromise;
}

function getPatchSize(definition, scale) {
  return definition.patchSizes?.[scale] || definition.patchSizes?.default || 64;
}

function roundPatchSize(value) {
  return Math.max(32, Math.round(value / 8) * 8);
}

function getAdaptivePatchSize(definition, scale, sourceCanvas, options = {}) {
  const basePatchSize = getPatchSize(definition, scale);
  const longestEdge = Math.max(sourceCanvas.width, sourceCanvas.height);
  const totalPixels = sourceCanvas.width * sourceCanvas.height;
  const deviceMemory =
    typeof navigator !== "undefined" ? navigator.deviceMemory || 8 : 8;
  const hardwareConcurrency =
    typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
  let nextPatchSize = basePatchSize;

  if (totalPixels > 1800 * 1800 || longestEdge > 2200) {
    nextPatchSize -= 24;
  } else if (totalPixels > 1200 * 1200 || longestEdge > 1600) {
    nextPatchSize -= 16;
  } else if (totalPixels > 900 * 900 || longestEdge > 1200) {
    nextPatchSize -= 8;
  }

  if (deviceMemory <= 4) {
    nextPatchSize -= 16;
  } else if (deviceMemory <= 6) {
    nextPatchSize -= 8;
  }

  if (hardwareConcurrency <= 4) {
    nextPatchSize -= 8;
  }

  if (options.previewMaxDimension && longestEdge <= 720) {
    nextPatchSize += 8;
  }

  return roundPatchSize(clamp(nextPatchSize, 32, basePatchSize + 16));
}

function getPostprocessProfile(definition, options) {
  const detailStrength = options.detailStrength || 0;
  const sharpenStrength = options.sharpenStrength || 0;
  const noiseReduction = options.noiseReduction || 0;

  if (definition.tier === "fast") {
    return {
      detailAmount: detailStrength * 0.1,
      sharpenAmount: sharpenStrength * 0.18,
      noiseAmount: noiseReduction * 0.12,
      colorAmount: 0.01,
      radius: 1,
    };
  }

  if (definition.tier === "balanced") {
    return {
      detailAmount: detailStrength * 0.16,
      sharpenAmount: sharpenStrength * 0.24,
      noiseAmount: noiseReduction * 0.18,
      colorAmount: 0.02,
      radius: 1,
    };
  }

  if (definition.tier === "quality") {
    return {
      detailAmount: detailStrength * 0.22,
      sharpenAmount: sharpenStrength * 0.3,
      noiseAmount: noiseReduction * 0.22,
      colorAmount: 0.03,
      radius: 1,
    };
  }

  return {
    detailAmount: detailStrength * 0.28,
    sharpenAmount: sharpenStrength * 0.34,
    noiseAmount: noiseReduction * 0.26,
    colorAmount: 0.04,
    radius: 1,
  };
}

async function createUpscalerInstance(definition, scale, onStatus) {
  onStatus?.(`Loading ${definition.label} runtime`);
  const tf = await ensureTensorflowBackend();
  const Upscaler = await getUpscalerConstructor();
  const loader = definition.loaders?.[scale];
  if (!loader) {
    throw new Error(`${definition.label} does not support ${scale}x output.`);
  }

  onStatus?.(`Loading ${definition.label} ${scale}x model`);
  const modelModule = await loader();
  const importedModelDefinition = modelModule.default || modelModule;
  const remotePath =
    definition.remoteModelPaths?.[scale] || importedModelDefinition.path;
  const modelDefinition = {
    ...importedModelDefinition,
    path: remotePath,
    _internals: {
      ...(importedModelDefinition._internals || {}),
      path: remotePath,
    },
  };
  const upscaler = new Upscaler({
    model: modelDefinition,
    warmupSizes: [],
  });

  upscaler.__backend = tf.getBackend();

  return upscaler;
}

async function warmupPatchSize(
  upscaler,
  definition,
  scale,
  patchSize,
  warmedPatchSizes,
  onStatus,
) {
  const warmupKey = `${scale}:${patchSize}`;
  if (warmedPatchSizes.has(warmupKey)) {
    return;
  }

  onStatus?.(`Warming ${patchSize}px patches`);
  await upscaler.warmup([{ patchSize, padding: definition.padding || 2 }], {
    awaitNextFrame: true,
  });
  warmedPatchSizes.add(warmupKey);
}

export function createRealUpscalerModel(definition) {
  const instances = new Map();
  const warmedPatchSizes = new Set();

  return {
    ...definition,
    async upscale(sourceCanvas, options = {}, onStatus) {
      const scale = options.scale || definition.scaleOptions?.[0] || 2;

      if (!instances.has(scale)) {
        instances.set(
          scale,
          createUpscalerInstance(definition, scale, onStatus),
        );
      }

      const upscaler = await instances.get(scale);
      const patchSize = getAdaptivePatchSize(
        definition,
        scale,
        sourceCanvas,
        options,
      );
      onStatus?.(`Downloading ${definition.label} assets if needed`);
      await warmupPatchSize(
        upscaler,
        definition,
        scale,
        patchSize,
        warmedPatchSizes,
        onStatus,
      );
      onStatus?.(`Upscaling ${scale}x with ${patchSize}px patches`);

      const base64 = await upscaler.upscale(sourceCanvas, {
        output: "base64",
        awaitNextFrame: true,
        patchSize,
        padding: definition.padding || 2,
        progress: (percent) => {
          onStatus?.(`Upscaling ${Math.max(1, Math.round(percent * 100))}%`);
        },
      });

      if (!base64 || typeof base64 !== "string") {
        throw new Error(
          `${definition.label} returned an invalid upscale result.`,
        );
      }

      onStatus?.("Post-processing output");
      const canvas = await sourceToCanvas(base64);
      const expectedWidth = sourceCanvas.width * scale;
      const expectedHeight = sourceCanvas.height * scale;

      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        throw new Error(
          `${definition.label} returned an unexpected output size (${canvas.width}x${canvas.height}) instead of ${expectedWidth}x${expectedHeight}.`,
        );
      }

      const profile = getPostprocessProfile(definition, options);

      if (options.noiseReduction > 0) {
        applyNoiseReduction(canvas, profile.noiseAmount, profile.radius);
      }

      if (options.adaptiveSharpen) {
        applyAdaptiveEnhance(canvas, {
          detailAmount: profile.detailAmount,
          sharpenAmount: profile.sharpenAmount,
          preserveEdges: options.preserveEdges,
          noiseReduction: profile.noiseAmount * 0.25,
          radius: profile.radius,
        });
      }

      applyColorFinish(canvas, profile.colorAmount);
      canvas.__upscalerMeta = {
        backend: upscaler.__backend || "cpu",
        remoteModelPath: definition.remoteModelPaths?.[scale] || null,
      };
      return canvas;
    },
  };
}
