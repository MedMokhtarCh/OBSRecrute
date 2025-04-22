import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue("notificationQueue");
  return channel;
};
