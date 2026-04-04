import { useEffect, useMemo, useRef, useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import {
  createDefaultTextLayer,
  createImageLayer,
  createStickerLayer,
  renderMeme,
} from "../../utils/meme-generator/index.js";
import {
  createCustomTemplate,
  drawCanvas,
  getRangeFields,
  getTimestamp,
} from "../../utils/meme-generator/editorHelpers.js";
import {
  findHitBound,
  getDragPositionPatch,
  getTransformPatch,
} from "../../utils/meme-generator/selectionUtils.js";

export default function useMemeEditor() {
  const [customTemplate, setCustomTemplate] = useState(null);
  const [templateSrc, setTemplateSrc] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [rendered, setRendered] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const [layers, setLayers] = useState([]);
  const [previewMaxWidth, setPreviewMaxWidth] = useState(1120);

  const previewCanvasRef = useRef(null);
  const previewFrameRef = useRef(null);
  const debounceRef = useRef(null);
  const templateImageInputRef = useRef(null);
  const layerImageInputRef = useRef(null);

  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedLayerId) || null,
    [layers, selectedLayerId],
  );

  const selectedBound = useMemo(
    () => rendered?.selectedBound || null,
    [rendered],
  );

  const rangeFields = useMemo(
    () => getRangeFields(selectedLayer),
    [selectedLayer],
  );

  useEffect(() => {
    if (!layers.length) {
      if (selectedLayerId) {
        setSelectedLayerId(null);
      }
      setSelectionVisible(false);
      return;
    }

    if (
      !selectedLayerId ||
      !layers.some((layer) => layer.id === selectedLayerId)
    ) {
      setSelectedLayerId(layers[layers.length - 1].id);
    }
  }, [layers, selectedLayerId]);

  useEffect(() => {
    if (!selectedLayerId) {
      setSelectionVisible(false);
      return;
    }

    if (selectedLayer?.lock) {
      setSelectionVisible(false);
      return;
    }

    setSelectionVisible(true);
  }, [selectedLayer, selectedLayerId]);

  useEffect(() => {
    const node = previewFrameRef.current;
    if (!node) {
      return undefined;
    }

    const updatePreviewWidth = () => {
      const nextWidth = Math.max(320, Math.floor(node.clientWidth));
      setPreviewMaxWidth((current) =>
        current === nextWidth ? current : nextWidth,
      );
    };

    updatePreviewWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        updatePreviewWidth();
      });
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updatePreviewWidth);
    return () => window.removeEventListener("resize", updatePreviewWidth);
  }, []);

  useEffect(() => {
    if (!templateSrc) {
      setRendered(null);
      setIsRendering(false);
      return undefined;
    }

    let active = true;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setIsRendering(true);
      setError(null);

      renderMeme(templateSrc, layers, {
        maxPreviewWidth: previewMaxWidth,
        selectedLayerId,
        hideSelectedLayer: selectionVisible && !selectedLayer?.lock,
      })
        .then((result) => {
          if (!active) return;
          drawCanvas(previewCanvasRef.current, result.canvas);
          setRendered(result);
        })
        .catch((renderError) => {
          console.error(renderError);
          if (active) {
            setError(renderError.message || "Failed to render meme preview.");
          }
        })
        .finally(() => {
          if (active) {
            setIsRendering(false);
          }
        });
    }, 120);

    return () => {
      active = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    templateSrc,
    layers,
    previewMaxWidth,
    selectedLayerId,
    selectedLayer?.lock,
    selectionVisible,
  ]);

  const updateLayer = (layerId, patch) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === layerId ? { ...layer, ...patch } : layer,
      ),
    );
  };

  const selectTemplate = (src) => {
    setError(null);
    setTemplateSrc(src);
  };

  const selectLayer = (layerId) => {
    setSelectedLayerId(layerId);
  };

  const addTextLayer = () => {
    const layer = createDefaultTextLayer("NEW TEXT", 0.5);
    layer.fontSize = 48;
    setLayers((current) => [...current, layer]);
    setSelectedLayerId(layer.id);
    setSelectionVisible(true);
  };

  const addStickerLayer = () => {
    const layer = createStickerLayer("🔥");
    setLayers((current) => [...current, layer]);
    setSelectedLayerId(layer.id);
    setSelectionVisible(true);
  };

  const handleTemplateUpload = (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError("Please select a valid image file for the template.");
      return;
    }

    if (!isValidSize(file, 20)) {
      setError("Template image is too large. Please use an image under 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result || null;
      if (!src) {
        setError(`Failed to read ${file.name}.`);
        return;
      }

      setError(null);
      setCustomTemplate(createCustomTemplate(file, src));
      setTemplateSrc(src);
    };
    reader.onerror = () => {
      setError(`Failed to read ${file.name}.`);
    };
    reader.readAsDataURL(file);
  };

  const handleLayerImage = (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError("Please select a valid image file for the layer.");
      return;
    }

    if (!isValidSize(file, 15)) {
      setError("Layer image is too large. Please use an image under 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const layer = createImageLayer(event.target?.result, file.name);
      setError(null);
      setLayers((current) => [...current, layer]);
      setSelectedLayerId(layer.id);
      setSelectionVisible(true);
    };
    reader.onerror = () => {
      setError(`Failed to read ${file.name}.`);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = (input) => {
    if (!input) return;

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fall through to click when showPicker is unavailable.
      }
    }

    input.click();
  };

  const openTemplateImagePicker = () => {
    openFilePicker(templateImageInputRef.current);
  };

  const openLayerImagePicker = () => {
    openFilePicker(layerImageInputRef.current);
  };

  const handleTemplateInputChange = (event) => {
    const file = event.target.files?.[0] || null;
    handleTemplateUpload(file);
    event.target.value = "";
  };

  const handleLayerInputChange = (event) => {
    const file = event.target.files?.[0] || null;
    handleLayerImage(file);
    event.target.value = "";
  };

  const removeLayer = (layerId) => {
    setLayers((current) => current.filter((layer) => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectionVisible(false);
      setSelectedLayerId(null);
    }
  };

  const toggleLayerLock = (layerId) => {
    const target = layers.find((layer) => layer.id === layerId);
    if (!target) return;
    updateLayer(layerId, { lock: !target.lock });
  };

  const handlePreviewPointerDown = ({ stageX, stageY, clickedOnEmpty }) => {
    const hit = findHitBound(rendered?.bounds, stageX, stageY);

    if (hit) {
      const hitLayer = layers.find((layer) => layer.id === hit.id) || null;
      setSelectedLayerId(hit.id);
      setSelectionVisible(!hitLayer?.lock);
      return;
    }

    if (!rendered?.bounds?.length || clickedOnEmpty) {
      setSelectionVisible(false);
    }
  };

  const handleSelectionTransform = ({ type, node }) => {
    if (
      !selectedLayer ||
      !selectedBound ||
      selectedLayer.lock ||
      !rendered?.canvas
    ) {
      return;
    }

    if (type === "dragEnd") {
      updateLayer(
        selectedLayer.id,
        getDragPositionPatch(node, rendered.canvas),
      );
      return;
    }

    if (type === "transformEnd") {
      updateLayer(
        selectedLayer.id,
        getTransformPatch(node, selectedBound, selectedLayer, rendered.canvas),
      );
      node.scaleX(1);
      node.scaleY(1);
      node.rotation(0);
    }
  };

  const handleExport = async (format) => {
    if (!templateSrc || isExporting) return;

    setIsExporting(true);
    setError(null);

    try {
      const result = await renderMeme(templateSrc, layers);
      await downloadCanvas(
        result.exportCanvas,
        `meme_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (exportError) {
      console.error(exportError);
      setError(exportError.message || "Failed to export meme.");
    } finally {
      setIsExporting(false);
    }
  };

  const inputAccept = getImageAcceptAttribute();
  const hasTemplate = Boolean(templateSrc);

  return {
    error,
    hasTemplate,
    preview: {
      hasTemplate,
      previewCanvasRef,
      previewFrameRef,
      rendered,
      selectedBound,
      selectedLayerLocked: Boolean(selectedLayer?.lock),
      selectedPreview: rendered?.selectedLayerCanvas || null,
      selectionVisible,
      isRendering,
      onSelectionTransform: handleSelectionTransform,
      onPreviewPointerDown: handlePreviewPointerDown,
    },
    templateGallery: {
      customTemplate,
      selectedTemplateSrc: templateSrc,
      inputAccept,
      templateImageInputRef,
      onTemplateInputChange: handleTemplateInputChange,
      onOpenTemplateImagePicker: openTemplateImagePicker,
      onSelectTemplate: selectTemplate,
    },
    toolbar: {
      inputAccept,
      layerImageInputRef,
      isExporting,
      onAddTextLayer: addTextLayer,
      onAddStickerLayer: addStickerLayer,
      onExport: handleExport,
      onLayerInputChange: handleLayerInputChange,
      onOpenLayerImagePicker: openLayerImagePicker,
    },
    layersPanel: {
      layers,
      selectedLayer,
      selectedLayerId,
      rangeFields,
      onRemoveLayer: removeLayer,
      onSelectLayer: selectLayer,
      onToggleLayerLock: toggleLayerLock,
      onUpdateLayer: updateLayer,
    },
  };
}
