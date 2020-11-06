const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector(".messageOne");
const messageTwo = document.querySelector(".messageTwo");
const locationButton = document.querySelector(".locationButton");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;
  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";
  document.querySelector(".weather-image").src = "";
  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        return (messageOne.textContent = data.error);
      }
      messageOne.textContent = data.address;
      messageTwo.textContent = data.forecast;
      document.querySelector(".weather-image").src = data.icon;
    });
  });
});

locationButton.addEventListener("click", async (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";
  document.querySelector(".weather-image").src = "";

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log(lat, lng);
    fetch(`/location?lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return (messageOne.textContent = data.error);
        }
        messageOne.textContent = data.address;
        messageTwo.textContent = data.forecast;
        document.querySelector(".weather-image").src = data.icon;
      });
  });
});
