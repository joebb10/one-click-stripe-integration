const { push, ref, set, getDatabase } = require("firebase/database");
const { app } = require("./firebase");


const addPlansToDB = async () => {
  const db = getDatabase(app);
  const plans = [
    {
      id: push(ref(db)).key, // Generate unique key for plan id
      name: 'Standard',
      cost: 30,
      description: 'Full access to all features.',
      isFree: false,
    },
  ];

  // Reference to the plans node
  const plansRef = ref(db, 'plans');

  plans.forEach(plan => {
    set(ref(db, 'plans/' + plan.id), plan);
  });
};

addPlansToDB(); // Call function to add plans to database
