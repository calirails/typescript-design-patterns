import { Person, Engineer } from "./entities";
import { KeyValuePairDatabase } from "./engine";
import { createDatabase } from "./factory";
import { createSingletonDatabase } from "./singleton";

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
  "================== Demonstration of Generic Database  ====================="
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
