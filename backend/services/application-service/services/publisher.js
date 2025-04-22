import amqp from "amqplib";

let channel;

export const connectPublisher = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("notificationQueue", { durable: true });
  console.log("📡 Publisher connected to RabbitMQ");
};

export const publishNotification = async (data) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }

  channel.sendToQueue("notificationQueue", Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });

  console.log("📤 Notification published:", data);
};
