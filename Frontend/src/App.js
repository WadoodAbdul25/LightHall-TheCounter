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
  const [clicksData, setClicksData] = useState(()=>{
      const savedClicksData = localStorage.getItem("clicksData");
    return savedClicksData !== null ? JSON.parse(savedClicksData) : [];
  })
  const [fiteredData, setFilteredData] = useState([])

  const handleCounter = async () => {
    setCounter(counter + 1);
    getLocation();
    const location = fiteredData.findIndex((location) => location.city === currLocation.city)

    if (currLocation.city === fiteredData[location].city) {
      const highestCounterValue = fiteredData[location].counter;
      const UpdatedClicksData = [...fiteredData]
      UpdatedClicksData[location] = { counter: highestCounterValue + counter, city: currLocation.city, country: currLocation.country }
      setClicksData(UpdatedClicksData);
       localStorage.setItem("clicksData", JSON.stringify(UpdatedClicksData));
      
    } else{
      setClicksData(fiteredData)
    }

    localStorage.setItem("currLocation", JSON.stringify(currLocation));

  }



  const handleReset = () => {
    setCounter(0);
    const location = clicksData.findIndex((location) => location.city === currLocation.city)

    axios.post('https://lighthall-thecounter.onrender.com/api/clicks', {
      counter: clicksData[location].counter,
      city: currLocation.city,
      country: currLocation.country
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    localStorage.setItem("clicks", counter);
    document.title = "TheCounter"
  }, [counter]);

  useEffect(() => {
    // console.log(currLocation);
  }, [currLocation]);



  useEffect(() => {
    axios.get('https://lighthall-thecounter.onrender.com/api/clicks')
      .then((res) => {
        const clicksByCity = {};

        // Filter and sort the response data
        res.data.forEach((click) => {
          const existingClick = clicksByCity[click.city];
          if (!existingClick || existingClick.counter < click.counter) {
            clicksByCity[click.city] = click;
          }
        });

        const filteredClicksData = Object.values(clicksByCity).sort((a, b) => b.counter - a.counter);
        console.log(filteredClicksData)
        setFilteredData(filteredClicksData);
    
      })
      .catch((err) => {
        console.log(err)
      });
  }, [counter]);





  const getLocation = async () => {
    const location = await axios.get('https://ipapi.co/json')
    setCurrLocation(location.data);
    axios.post('https://lighthall-thecounter.onrender.com/api/clicks', {
      counter: counter,
      city: location.data.city,
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
