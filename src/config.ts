export interface Config {
  youTrackToken: string;
  youTrackAuthor: string;
  vkTeamsBotToken: string;
  vkTeamsChatId: string;
}
const youTrackToken = process.env.YOUTRACK_TOKEN || '';
const youTrackAuthor = process.env.YOUTRACK_AUTHOR || '';
const vkTeamsBotToken = process.env.VK_TEAMS_BOT_TOKEN || '';
const vkTeamsChatId = process.env.VK_TEAMS_CHAT_ID || '';

const config: Config = {
  youTrackToken,
  youTrackAuthor,
  vkTeamsBotToken,
  vkTeamsChatId,
};

export default config;