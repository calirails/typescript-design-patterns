import { Person, Engineer } from "./database/models";
import { KeyValuePairDatabase } from "./database/engine";
import { createDatabase } from "./gang-of-four/factory";
import { createSingletonDatabase } from "./gang-of-four/singleton";
import { RedisObservableDatabase } from "./gang-of-four/observer";
import { TraversableDatabase } from "./gang-of-four/visitor";
import { RankableStrategyDatabase } from "./gang-of-four/strategy";
import { loadRecords, PersonRecordAdapter } from "./gang-of-four/adapter";

const PersonKVPDatabase = new KeyValuePairDatabase<Person>();
const edison = "person::edison";
PersonKVPDatabase.set(<Person>{
  id: edison,
  name: "Thomas Edison",
  description: "Inventor",
});

const karpathy = "engineer::karpathy";
PersonKVPDatabase.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy",
  description: "ML/AI Engineer",
  role: "director of FSD",
  level: 23,
});

console.log(
  "================== Start of /src/database/index.ts ====================="
);
console.log("\n\r");

console.log(
  "================== Demonstration of Database Models/Entities and Storage Engine via Generic Classes ====================="
);
console.log('Retrieving first person; i.e. "edison" added to database');
const edisonRecord = PersonKVPDatabase.get(edison);
console.table({ edisonRecord });

console.log('Retrieving first Engineer; i.e. "karpathy" added to database');
const karpathyRecord = PersonKVPDatabase.get(karpathy);
console.table({ karpathyRecord });

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Factory Design Pattern with separate Database instance ====================="
);

console.log(
  "Using Factory Pattern to create a different Database Intance than previous instance."
);

const PersonDatabaseInstanceFromFactory = createDatabase<Person>();
PersonDatabaseInstanceFromFactory.set(<Person>{
  id: edison,
  name: "Thomas Edison",
  description: "Inventor",
});

PersonDatabaseInstanceFromFactory.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy",
  description: "ML/AI Engineer",
  role: "director of FSD",
  level: 23,
});

console.log('Retrieving first person; i.e. "edison" added to database');
const edisonRecordFromFactoryInstance =
  PersonDatabaseInstanceFromFactory.get(edison);
console.table({ edisonRecordFromFactoryInstance });

console.log('Retrieving first Engineer; i.e. "karpathy" added to database');
const karpathyRecordFromFactoryInstance = PersonKVPDatabase.get(karpathy);
console.table({ karpathyRecordFromFactoryInstance });

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Factory with Singleton Design Pattern ====================="
);

console.log(
  "Using Factory Pattern to create a different Database Intance than previous instance."
);

const RedisSingletonDatabaseFromFactory = createSingletonDatabase<Person>();
RedisSingletonDatabaseFromFactory.instance.set(<Person>{
  id: edison,
  name: "Thomas Edison",
  description: "Inventor",
});

RedisSingletonDatabaseFromFactory.instance.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy",
  description: "ML/AI Engineer",
  role: "director of FSD",
  level: 23,
});

console.log('Retrieving first person; i.e. "edison" added to database');
const edisonRecordFromRedisSingletonInstance =
  RedisSingletonDatabaseFromFactory.instance.get(edison);
console.table({ edisonRecordFromRedisSingletonInstance });

console.log('Retrieving first Engineer; i.e. "karpathy" added to database');
const karpathyFromRedisSingletonInstance =
  RedisSingletonDatabaseFromFactory.instance.get(karpathy);
console.table({ karpathyFromRedisSingletonInstance });

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Observable/Auditable Database Design Pattern ====================="
);

console.log(
  "Adding Observable Design Pattern on top of Factory and Singleton Database Intance rather than previous instances."
);

// Add observer with a function that receives an instance of <T> log for visibility; can also destruture to just the value
const redisObservableDatabase = new RedisObservableDatabase();
const terminateAfterSetSubscription = redisObservableDatabase.onAfterSet(
  (event) => {
    console.log(
      "Observable callback triggered from Observable Database AfterSet event triggered"
    );
    console.table({
      fromValue: event.existingValue,
      toValue: event.newValue,
      happenedAt: event.createdAt.toDateString(),
    });
    // console.table({ ...event });
  }
);

// Set it initially with no prior value
redisObservableDatabase.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V1",
  description: "ML/AI Engineer.V1",
  role: "director of FSD.V1",
  level: 23,
});

// Set it again to see the prior value
redisObservableDatabase.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V2",
  description: "ML/AI Engineer.V2",
  role: "director of FSD.V2",
  level: 46,
});

// Now terminate subscription and expect that no more events are dispatched for this AfterSet<T> listener
terminateAfterSetSubscription();
console.log(
  'AfterSet listener has unsubscribed and will not receive the "V3" updates from Observable Database and has no readily available reference to re-subscribe once termianted.'
);
// Set it again to see the prior value
redisObservableDatabase.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V3",
  description: "ML/AI Engineer.V3",
  role: "director of FSD.V3",
  level: 46,
});

console.log("\n\r");
console.log("AfterDelete listener subscribed to track deletes.");

const terminateAfterDeleteSubscription = redisObservableDatabase.onAfterDelete(
  (event) => {
    console.log(
      "Observable AfterDelete event callback triggered from Observable Database "
    );
    console.table({
      fromValue: event.existingValue,
      happenedAt: event.deletedAt.toDateString(),
    });
  }
);

// Delete the last modified record V3 instance of the reord
redisObservableDatabase.delete(karpathy);

console.log(
  "Confirming the deleted record is no longer retrievable from Database."
);
const goner = redisObservableDatabase.get(karpathy);
console.table({ goner });

terminateAfterDeleteSubscription();

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Visitor Design Pattern to visit each database item/node ====================="
);

const graphDatabaseInstance = new TraversableDatabase<Person>();
graphDatabaseInstance.set(<Person>{
  id: edison,
  name: "Thomas Edison",
  description: "Inventor",
});

graphDatabaseInstance.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V2",
  description: "ML/AI Engineer.V2",
  role: "director of FSD.V2",
  level: 46,
});

graphDatabaseInstance.set(<Engineer>{
  id: "elon-musk",
  name: "Elon Musk",
  description: "Tesla & Space X Founder",
  role: "Innovator",
  level: 420,
});

graphDatabaseInstance.visit((person: Person) => {
  console.log(`Visitor has encountered the following record.`);
  console.table({ person });
});

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Vistor Design Pattern to visit each database item/node ====================="
);

const rankableDatabase = new RankableStrategyDatabase<Engineer>();
rankableDatabase.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V2",
  description: "ML/AI Engineer.V2",
  role: "director of FSD.V2",
  level: 46,
  pay: 500000,
});

rankableDatabase.set(<Engineer>{
  id: "elon-musk",
  name: "Elon Musk",
  description: "Tesla & Space X Founder",
  role: "Innovator",
  level: 420,
  pay: 900000,
});

rankableDatabase.set(<Engineer>{
  id: "einstein",
  name: "Albert Einsten",
  description: "Physics and Astrophysics Extraordinaire",
  role: "Genius",
  level: 999,
  // coommented out to simulate someone who is unpaid for null handling case
  // pay: 900000
});

const highestRankingEngineer = rankableDatabase.selectHighestRank(
  (item) => item.level
);
console.table({
  "top-ranked-engineer": "rankedByLevel",
  highestRankingEngineer,
});

const topPaidEngineer = rankableDatabase.selectHighestRank(
  (item) => item.pay ?? -1
);
console.table({ "top-paid-engineer": "rankedByLevel", topPaidEngineer });

console.log("\n\r");
console.log("\n\r");
console.log(
  "================== Demonstration of Adapter Design Pattern that is used to write, by adapting serialized objects into records stored in a Database ====================="
);

// create an instance of the Adapter that will adapt each serialized json object into a database record.
const targetDb = new RedisObservableDatabase<Person>();
targetDb.onAfterSet((event) => {
  console.log("Record loaded to backup database");
  console.table({ event, ...event.newValue });
});
const personRecordAdapter = new PersonRecordAdapter()
  .name("DB-Backup")
  .database(targetDb);
// Load the database
loadRecords("./data/persons.json", personRecordAdapter);
