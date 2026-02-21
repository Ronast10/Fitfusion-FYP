import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Tips.css";

export default function Tips() {

  const [filter, setFilter] = useState("All");

  // BMI STATES

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiAdvice, setBmiAdvice] = useState("");



  // BMI FUNCTION

  const calculateBMI = () => {

    if (!height || !weight) {
      alert("Please enter height and weight");
      return;
    }

    const heightMeter = height / 100;

    const bmi = (weight / (heightMeter * heightMeter)).toFixed(1);

    setBmiResult(bmi);


    if (bmi < 18.5) {

      setBmiCategory("Underweight");

      setBmiAdvice("You need to increase calorie intake and focus on strength training to gain healthy weight.");

    }

    else if (bmi >= 18.5 && bmi < 24.9) {

      setBmiCategory("Normal");

      setBmiAdvice("You are in a healthy range. Maintain your current diet and exercise routine.");

    }

    else if (bmi >= 25 && bmi < 29.9) {

      setBmiCategory("Overweight");

      setBmiAdvice("You should focus on fat loss through calorie deficit and regular exercise.");

    }

    else {

      setBmiCategory("Obese");

      setBmiAdvice("You need structured fat loss plan with proper diet and regular physical activity.");

    }

  };



  // ==============================
  // VIDEO DATA
  // ==============================

  const videoData = [

    { id: 1, title: "Complete Weight Gain Guide", category: "Weight Gain", videoId: "996mkJwILiQ" },
    { id: 2, title: "How to Gain Weight Fast & Healthy", category: "Weight Gain", videoId: "S21o1IdwWf8" },
    { id: 3, title: "High Calorie Diet Plan", category: "Weight Gain", videoId: "9T43EDBs1jw" },
    { id: 4, title: "Best Foods for Weight Gain", category: "Weight Gain", videoId: "lu_BObG6dj8" },

    { id: 5, title: "Science Based Fat Loss", category: "Weight Loss", videoId: "roHQ3F7d9YQ" },
    { id: 6, title: "Beginner Fat Loss Plan", category: "Weight Loss", videoId: "TuRv8gRfvb8" },
    { id: 7, title: "How to Lose Belly Fat", category: "Weight Loss", videoId: "uKXF3eS79_A" },
    { id: 8, title: "Complete Weight Loss Strategy", category: "Weight Loss", videoId: "LTM-tSGGhI4" },

    { id: 9, title: "How to Bulk Properly", category: "Bulk", videoId: "0niz8Oof7S0" },
    { id: 10, title: "Clean Bulk Diet Plan", category: "Bulk", videoId: "P_v2ZueSrk8" },

    { id: 11, title: "How to Cut Without Losing Muscle", category: "Cut", videoId: "DzjWEn2BS_k" },
    { id: 12, title: "Cutting Diet Explained", category: "Cut", videoId: "mDOn_p14DAs" },

    { id: 13, title: "Arnold Golden Era Training", category: "Bodybuilding", videoId: "vcFreeY_XpU" },
    { id: 14, title: "Classic Physique Training Guide", category: "Bodybuilding", videoId: "wkBtHOBmpb0" }
  ];


  const categories = ["All", "Weight Gain", "Weight Loss", "Bulk", "Cut", "Bodybuilding"];

  const filteredVideos = filter === "All" ? videoData : videoData.filter(v => v.category === filter);



  return (

    <div className="tips-page">

      <Navbar />



      {/* HERO */}

      <section className="tips-hero">

        <h1>FITNESS <span>INTELLIGENCE</span></h1>

        <p>Science-backed strategies for transforming your body.</p>

      </section>



      {/* UPDATED BMI SECTION */}

      <section className="bmi-section">

        <h2>BMI (Body Mass Index)</h2>


        <p>

          BMI is a measurement that helps determine whether your body weight is healthy for your height.

          It is calculated using this formula:

        </p>


        <p><strong>BMI = Weight (kg) / Height (m²)</strong></p>


        <p>

          It helps identify if you are underweight, normal weight, overweight, or obese.

        </p>



        {/* CALCULATOR */}

        <div className="bmi-calculator">

          <input

            type="number"

            placeholder="Enter height (cm)"

            value={height}

            onChange={(e) => setHeight(e.target.value)}

          />


          <input

            type="number"

            placeholder="Enter weight (kg)"

            value={weight}

            onChange={(e) => setWeight(e.target.value)}

          />


          <button onClick={calculateBMI}>Calculate BMI</button>

        </div>



        {/* RESULT */}

        {bmiResult && (

          <div className="bmi-result">

            <h3>Your BMI: {bmiResult}</h3>

            <h3>Category: {bmiCategory}</h3>

            <p>{bmiAdvice}</p>

          </div>

        )}


      </section>



      {/* KEEPING REST SAME */}

      {/* KNOWLEDGE SECTION */}

      <section className="knowledge-section">

        {/* your existing cards unchanged */}

      </section>



      {/* VIDEO SECTION */}

      <section className="video-explorer">

        <h2>Expert Video Guides</h2>

        <div className="filter-bar">

          {categories.map(cat => (

            <button

              key={cat}

              className={filter === cat ? "active" : ""}

              onClick={() => setFilter(cat)}

            >

              {cat}

            </button>

          ))}

        </div>



        <div className="video-grid">

          {filteredVideos.map(video => (

            <div key={video.id} className="video-card">

              <iframe

                src={`https://www.youtube.com/embed/${video.videoId}`}

                title={video.title}

                allowFullScreen

              ></iframe>

              <h4>{video.title}</h4>

            </div>

          ))}

        </div>

      </section>



      <Footer />

    </div>

  );

}