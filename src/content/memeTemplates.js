const BASE = import.meta.env.BASE_URL;
const templateEntries = [
  ["ancient-aliens", "Ancient Aliens", "ancient_aliens.jpg"],
  [
    "batman-slapping-robin",
    "Batman Slapping Robin",
    "batman_slapping_robin.jpg",
  ],
  [
    "bernie-i-am-once-again-asking-for-your-support",
    "Bernie I Am Once Again Asking For Your Support",
    "bernie_i_am_once_again_asking_for_your_support.jpg",
  ],
  ["bike-fall", "Bike Fall", "bike_fall.jpg"],
  ["blank-nut-button", "Blank Nut Button", "blank_nut_button.jpg"],
  ["change-my-mind", "Change My Mind", "change_my_mind.jpg"],
  [
    "clown-applying-makeup",
    "Clown Applying Makeup",
    "clown_applying_makeup.jpg",
  ],
  ["disaster-girl", "Disaster Girl", "disaster_girl.jpg"],
  ["distracted-boyfriend", "Distracted Boyfriend", "distracted_boyfriend.jpg"],
  ["drake-hotline-bling", "Drake Hotline Bling", "drake_hotline_bling.jpg"],
  ["epic-handshake", "Epic Handshake", "epic_handshake.jpg"],
  ["evil-kermit", "Evil Kermit", "evil_kermit.jpg"],
  ["expanding-brain", "Expanding Brain", "expanding_brain.jpg"],
  ["grus-plan", "Gru's Plan", "grus_plan.jpg"],
  [
    "i-bet-hes-thinking-about-other-women",
    "I Bet He's Thinking About Other Women",
    "i_bet_hes_thinking_about_other_women.jpg",
  ],
  ["is-this-a-pigeon", "Is This A Pigeon", "is_this_a_pigeon.jpg"],
  [
    "left-exit-12-off-ramp",
    "Left Exit 12 Off Ramp",
    "left_exit_12_off_ramp.jpg",
  ],
  ["marked-safe-from", "Marked Safe From", "marked_safe_from.jpg"],
  ["mocking-spongebob", "Mocking Spongebob", "mocking_spongebob.jpg"],
  ["one-does-not-simply", "One Does Not Simply", "one_does_not_simply.jpg"],
  ["running-away-balloon", "Running Away Balloon", "running_away_balloon.jpg"],
  ["sad-pablo-escobar", "Sad Pablo Escobar", "sad_pablo_escobar.jpg"],
  [
    "theyre-the-same-picture",
    "They're The Same Picture",
    "theyre_the_same_picture.jpg",
  ],
  ["two-buttons", "Two Buttons", "two_buttons.jpg"],
  ["uno-draw-25-cards", "UNO Draw 25 Cards", "uno_draw_25_cards.jpg"],
  ["woman-yelling-at-cat", "Woman Yelling At Cat", "woman_yelling_at_cat.jpg"],
  ["x-x-everywhere", "X, X Everywhere", "x_x_everywhere.jpg"],
  [
    "yall-got-any-more-of-that",
    "Y'all Got Any More Of That",
    "yall_got_any_more_of_that.jpg",
  ],
];

export const memeTemplates = templateEntries.map(([id, title, fileName]) => ({
  id,
  title,
  src: `${BASE}/images/memes_template/${fileName}`,
}));

export default memeTemplates;
