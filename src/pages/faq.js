import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const btn =
  "bg-teal-700 rounded-md px-3 py-2 text-white hover:bg-teal-600 w-[200px] m-1";

const INPUT_LS_KEY = "faq.question";

const Faq = ({ fetchedQuestions }) => {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const search = localStorage.getItem(INPUT_LS_KEY);
    if (search) {
      handleChange({ target: { value: search } });
    } else setQuestions(fetchedQuestions.map((q) => ({ ...q, isOpen: false })));
  }, [fetchedQuestions]);

  const handleClickQuestion = (index) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, isOpen: !q.isOpen } : q))
    );
  };

  const handleBtn = (isOpen) => {
    setQuestions((prev) => prev.map((q) => ({ ...q, isOpen })));
  };

  const handleChange = ({ target: { value } }) => {
    setInput(value);
    setResponse("");
    localStorage.setItem(INPUT_LS_KEY, value);
    const newQuestions = fetchedQuestions
      .filter(
        ({ question: q, answer: a }) =>
          q.toLowerCase().includes(value.toLowerCase()) ||
          a.toLowerCase().includes(value.toLowerCase())
      )
      .map((q) => ({ ...q, isOpen: true }));
    if (newQuestions.length) {
      setQuestions(newQuestions);
    } else {
      setQuestions([]);
      setResponse("No questions found with that subject");
    }
  };

  return (
    <div className='py-12 sm:px-6 md:px-12 lg:px-24 font-sans bg-slate-950 w-full h-screen text-slate-50'>
      <h1 className={`text-center mb-6 font-bold text-3xl`}>
        Frequently Asked Questions
      </h1>
      <div className='px-2 md:px-0 max-w-[800px] md:mx-auto'>
        <input
          type='text'
          placeholder='Search for a question'
          onChange={handleChange}
          value={input}
          className='focus:outline-none border border-slate-200 w-full p-2 rounded mb-6 text-lg md:mx-0 text-slate-900'
        />
      </div>
      <div className='flex content-center w-full max-w-[800px] mb-6 mx-auto flex-wrap justify-center md:justify-between'>
        <button onClick={() => handleBtn(true)} className={btn}>
          Expand all questions
        </button>
        <button onClick={() => handleBtn(false)} className={btn}>
          Collapse all questions
        </button>
      </div>
      <ul className='list-none bg-slate-400 mx-2 p-2 md:m-0 md:p-6 rounded-md text-slate-950  max-w-[800px] md:mx-auto'>
        {response && <p className={`text-center text-xl`}>{response}</p>}
        {questions.map(({ question, answer, isOpen }, index) => (
          <li
            key={question}
            onClick={() => handleClickQuestion(index)}
            className={`bg-slate-100 my-4 p-4 rounded hover:bg-slate-200 cursor-pointer`}
          >
            <h3 className={`flex justify-between content-center`}>
              <span className='w-[90%]'>
                {index + 1}. {question}
              </span>
              <span
                className={`${
                  isOpen ? "-rotate-90" : "rotate-90"
                } transition-transform text-teal-700 block w-[24px] h-[24px]`}
              >
                &#10148;
              </span>
            </h3>
            {isOpen ? (
              <div className={`mt-4 pt-4 border-t border-t-slate-300`}>
                {answer}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export function getStaticProps() {
  const dummyQuestions = [
    {
      question: "What is Next.js?",
      answer: "Next.js is a React framework for building web applications.",
    },
    {
      question: "How does Tailwind CSS work?",
      answer:
        "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.",
    },
    {
      question: "What is the purpose of getStaticProps?",
      answer: "getStaticProps is used to fetch data at build time in Next.js.",
    },
  ];
  return {
    props: { fetchedQuestions: dummyQuestions },
  };
}

export default Faq;

Faq.propTypes = {
  fetchedQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.string,
    })
  ),
};
