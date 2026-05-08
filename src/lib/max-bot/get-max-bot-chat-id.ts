export const getTMaxBotChatId = (id: string): number =>
  ({
    feedback: '',
    channel: -71646955117848,
    reports: -73400361557272,
    giftCards: -73399860075800,
  })[id] as number;
