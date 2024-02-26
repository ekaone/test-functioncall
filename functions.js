function getCurrentWeather(location, unit = "fahrenheit") {
  if (location.toLowerCase().includes("tokyo")) {
    return JSON.stringify({
      asd: "Tokyo",
      temperature: "10",
      unit: "celsius",
    });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({
      asd: "San Francisco",
      temperature: "72",
      unit: "fahrenheit",
    });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({
      asd: "Paris",
      temperature: "22",
      unit: "fahrenheit",
    });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }
}

function getUserStatus(status) {
  const users = [
    {
      name: "John",
      age: "20",
      status: "active",
    },
    {
      name: "Jane",
      age: "22",
      status: "inactive",
    },
    {
      name: "Bob",
      age: "25",
      status: "active",
    },
    {
      name: "Alice",
      age: "30",
      status: "inactive",
    },
    {
      name: "Eve",
      age: "28",
      status: "active",
    },
  ];

  if (status.toLowerCase() === "active") {
    return JSON.stringify(
      users
        .filter((user) => user.status === "active")
        .map((user) => {
          return { name: user.name, age: user.age, status: user.status };
        })
    );
  } else if (status.toLowerCase() === "inactive") {
    return JSON.stringify(
      users
        .filter((user) => user.status === "inactive")
        .map((user) => {
          return { name: user.name, age: user.age, status };
        })
    );
  } else {
    return JSON.stringify(users);
  }
}

export { getCurrentWeather, getUserStatus };
