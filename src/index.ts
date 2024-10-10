import axios from 'axios';
import config from './config';
import { Handler } from "@yandex-cloud/function-types";

interface Duration {
  presentation: string
}

interface Issue {
  idReadable: string
}

interface WorkItem {
  id: string
  text: string
  date: number
  created: number
  duration: Duration
  issue: Issue
}

async function getYouTrackWorkItemsByToday(): Promise<WorkItem[]> {
  const paramsObj =
  {
    fields: "created,duration(presentation),issue(idReadable),text,date,id",
    author: config.youTrackAuthor,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  };
  const searchParams = new URLSearchParams(paramsObj);
  const url = `https://youtrack.inguru.dev/api/workItems?${searchParams.toString()}`;

  const { data } = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.youTrackToken}`,
    }
  });

  return data;
}

async function sendToVkTeams(text: string) {
  const paramsObj = {
    token: config.vkTeamsBotToken,
    chatId: config.vkTeamsChatId,
    text,
  }
  const searchParams = new URLSearchParams(paramsObj);

  const { data } = await axios.get(`https://myteam.mail.ru/bot/v1/messages/sendText?${searchParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  console.log(data)
}


export const handler: Handler.Timer = async (event) => {
  for (const _ of event.messages) {
    const workItems = await getYouTrackWorkItemsByToday()

    const reports: string[] = [];

    for (const item of workItems) {
      reports.push(`${item.issue.idReadable}: ${item.text.length === 0 ? 'Разработка' : item.text} (${item.duration.presentation})`)
    }

    const text = reports.join("\n");

    console.log(text)

    await sendToVkTeams(text)
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
  }
};