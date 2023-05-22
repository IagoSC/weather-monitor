import { Kafka } from "kafkajs";
import { config } from "./config";

const kafka = new Kafka({ brokers: [config.brokers] });

const admin = kafka.admin({});
const consumer = kafka.consumer({ groupId: "AAAA" });
consumer.connect();
admin.connect();

const consume = async () => {
  consumer.run({
    eachMessage: async ({ message }) => {
      const val = JSON.parse(message.value!.toString());
      console.log(val);
      console.log(val.type);
    },
  });
  return Promise.resolve();
};

const run = async () => {
  const topics = await admin.listTopics();
  const groups = await admin.listGroups();
  const cluster = await admin.describeCluster();

  consumer.subscribe({ topic: "super_event" });
  consume();

  console.log("groups", groups);
  console.log("topics", topics);
  console.log("cluster", cluster);
  //   Promise.all(
  //     topics.map((topic) =>
  //       admin.deleteTopicRecords({
  //         topic,
  //         partitions: [{ offset: "0", partition: 0 }],
  //       })
  //     )
  //   );
  //   admin.deleteTopics({ topics });
  //   const topics2 = await admin.listTopics();
  //   console.log(topics2);
};

run();
