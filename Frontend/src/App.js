import { useState, useEffect } from "react";
import './App.css'
import axios from "axios";

function App() {
  const [counter, setCounter] = useState(() => {
    const savedValue = localStorage.getItem("clicks");
    return savedValue !== null ? parseInt(savedValue) : 0;
  })

  const [currLocation, setCurrLocation] = useState(() => {
    const savedLocation = localStorage.getItem("currLocation");
    return savedLocation !== null ? JSON.parse(savedLocation) : null;
  });
  const [clicksData, setClicksData] = useState([])

  const handleCounter = () => {
    setCounter(counter + 1);
    getLocation();
    localStorage.setItem("currLocation", JSON.stringify(currLocation));

  }

  const handleReset = ()=>{
    setCounter(0);
  }

  useEffect(() => {
    localStorage.setItem("clicks", counter);
    document.title = "TheCounter"
  }, [counter]);

  useEffect(() => {
    console.log(currLocation);
  }, [currLocation]);


  
  useEffect(() => {
    axios.get('https://lighthall-thecounter.onrender.com/api/clicks')

      .then((res) => {

        for (let i = 0; i < res.data.length; i++) {
          const locationData = {
            counter:res.data[i].counter,
            city: res.data[i].city,
            country: res.data[i].country
          };
          setClicksData((prevClicksData) => {
            const alreadyExists = prevClicksData.some(clickData => clickData.city === locationData.city);
            const newData = alreadyExists ? prevClicksData : [...prevClicksData, locationData];
          // Check that the new data is being created correctly
            return newData;
          });
        }
        
      }).catch((err) => {
        console.log(err)
      })

  }, [counter]);





  const getLocation = async () => {
    const location = await axios.get('https://ipapi.co/json')
    setCurrLocation(location.data);
    axios.post('https://lighthall-thecounter.onrender.com/api/clicks', {
      counter: counter,
      city: location.data.region,
      country: location.data.country
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  


  return (
    <div className="App">

      <header className="navbar">
        <h1>TheCounter</h1>
      </header>

      <div className="mainbox">

        <div className="content1">
          <h2 className="text-3xl text-white font-semibold ">Number of Clicks:</h2>
          <p className="text-3xl text-white font-semibold">{counter}</p>
          {currLocation && <p className="text-3xl text-white font-semibold">{currLocation.city}, {currLocation.country}</p>}
          <button className="btn" onClick={handleCounter}>Click!</button>
          <button className="reset" onClick={handleReset}>Reset</button>
        </div>

        <div className="content2">
          <strong className="text-xl text-white font-semibold" >Other Clicks from around the world:</strong>
          {clicksData.length > 0 && (
            <div className="table">
              {clicksData.map((click, index) => (
                <div className="clickdata" key={index}>
                  <p>{click.counter}</p>
                  <p>{click.city}</p>
                  <p>{click.country}</p>

                </div>

              ))}
            </div>
          )}

        </div>


      </div>


    </div >
  );
}

export default App;
