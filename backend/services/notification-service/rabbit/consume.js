import { connectRabbitMQ } from "./connect.js";

export const consumeMessages = async (handleMessage) => {
  const channel = await connectRabbitMQ();

  channel.consume("notificationQueue", (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      handleMessage(data);
      channel.ack(msg);
    }
  });
};
