import React, { useEffect, useState } from "react";
import loader from "../Assets/loader.gif";
import wrong from "../Assets/wrong.gif";

const LandingPage = ({ level }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [skip, setSkip] = useState(0);
  // const [shuffledAnswers, setShuffledAnswers] = useState([]);


  //TODO func to fetch data from API
  async function fetchData() {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&type=multiple&cate&difficulty=${level}`
      );
      const data = await response.json();
      if (data.response_code === 0) {
        setLoading(false);
        setQuestions(data.results);
      } else {
        setLoading(false);
        setQuestions([]);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    document.title = `Quiz Level ${level.toUpperCase()}`;
    fetchData();
  }, []);



  //TODO handle click on answer
  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    //* Move to the next question
    setCurrentQuestion(currentQuestion + 1);
  };

  //TODO handle to skip question
  const handleSkip = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSkip(skip + 1);
  };

  //TODO Helper function to shuffle array elements
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  //TODO render according to condition
  const renderQuestion = () => {
    const question = questions[currentQuestion];

    if (!question) {
      // Quiz completed
      return (
        <div className="result">
          <p>Quiz Completed!</p>
          <p>
            Your Score : <span>{score}</span>/10
          </p>
          <p>
            Skipped Questions : <span>{skip}</span>
          </p>
          <button className="skip-btn" onClick={() => window.location.reload()}>
            Restart
          </button>
        </div>
      );
    }

    // * Shuffle the answer options
    const shuffledAnswers = shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer,
    ]);

    return (
      <div className="question">
        <div className="ctg">
          {"Category: "}&nbsp;<span>{question.category}</span>
        </div>
        <h3>
          Q-{currentQuestion + 1}. <span dangerouslySetInnerHTML={{__html: question.question}}/>
        </h3>
        <ul>
          {shuffledAnswers.map((answer, index) => (
            <li key={answer} onClick={() => handleAnswerClick(answer)}>
              <span>{String.fromCharCode(index + 65)}.</span>{" "}
              <span dangerouslySetInnerHTML={{__html: answer}}/>
            </li>
          ))}
        </ul>
        <button onClick={handleSkip} className="skip-btn">
          Skip Question
        </button>
      </div>
    );
  };

  //TODO Rendering data to UI
  return (
    <div className="landing">
      {isLoading ? (
        <div className="loading">
          <img src={loader} alt="" className="loader" />
        </div>
      ) : questions.length === 0 ? (
        <div className="loading">
          <img src={wrong} alt="" className="wrong" />
          <h4>SOMETHING WENT WRONG</h4> <br></br>
          <button onClick={() => window.location.reload()} className="reload">
            Reload
          </button>
        </div>
      ) : (
        <div className="questions">{renderQuestion()}</div>
      )}
    </div>
  );
};

export default LandingPage;