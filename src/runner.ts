import { Person, Engineer } from "./database/models";
import { KeyValuePairDatabase } from "./database/engine";
import { createDatabase } from "./gang-of-four/factory";
import { createSingletonDatabase } from "./gang-of-four/singleton";
import { createSingletonObservableDatabase } from "./gang-of-four/observer";

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

debugger;
const RedisObservableDatabaseFromFactory =
  createSingletonObservableDatabase<Person>();
// Add observer with a function that receives an instance that we destruture to just the value
// RedisObservableDatabaseFromFactory.instance.onAfterSet(
//   ({ existingValue, newValue, createdAt }) => {
//     console.log(
//       "Observable callback triggered from Observable Database AfterSet event triggered"
//     );
//     console.table({ createdAt, existingValue, newValue });
//   }
// );

RedisObservableDatabaseFromFactory.instance.onAfterSet((event) => {
  console.log(
    "Observable callback triggered from Observable Database AfterSet event triggered"
  );
  console.table({ ...event });
});

// Set it initially with no prior value
RedisObservableDatabaseFromFactory.instance.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V1",
  description: "ML/AI Engineer.V1",
  role: "director of FSD.V1",
  level: 23,
});

// Set it again to see the prior value
RedisObservableDatabaseFromFactory.instance.set(<Engineer>{
  id: karpathy,
  name: "Andrei Karpathy.V2",
  description: "ML/AI Engineer.V2",
  role: "director of FSD.V2",
  level: 46,
});
