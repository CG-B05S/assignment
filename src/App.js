import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>GitHub Issues</h1>
        <Routes>
          <Route path="/issues/:number" element={<IssuePage />} />
          <Route path="/" element={<IssueList />} />
        </Routes>
      </div>
    </Router>
  );
}

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const perPage = 10;
    const fetchIssues = async () => {
      const response = await fetch(
        `https://api.github.com/repos/GoogleChrome/workbox/issues?state=open&per_page=${perPage}&page=${currentPage + 1
        }`
      );
      const data = await response.json();
      setIssues(data);
      const totalCount =
        parseInt(
          response.headers.get("link").match(/&page=(\d+)>; rel="last"/)[1],
          10
        ) * perPage;
      setTotalPages(Math.ceil(totalCount / perPage));
    };
    fetchIssues();
  }, [currentPage]);

  const handlePageChange = (event) => {
    setCurrentPage(parseInt(event.target.innerText) - 1);
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Issue Number</th>
            <th>Title</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.number} className="issue-row">
              <td className="issue-number">
                <Link to={`/issues/${issue.number}`} className="issue-link">{issue.number}</Link>
              </td>
              <td className="issue-title">{issue.title}</td>
              <td className="issue-author">{issue.user.login}</td>
            </tr>

          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from(Array(totalPages), (e, i) => i).map((pageNumber) => (
          <button
            key={pageNumber}
            className={pageNumber === currentPage ? "active" : ""}
            onClick={handlePageChange}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </>
  );
}

function IssuePage() {
  const { number } = useParams();
  const [issue, setIssue] = useState({});

  useEffect(() => {
    const fetchIssue = async () => {
      const response = await fetch(
        `https://api.github.com/repos/GoogleChrome/workbox/issues/${number}`
      );
      const data = await response.json();
      setIssue(data);
    };
    fetchIssue();
  }, [number]);

  return (
    <>
      <div className="issue-details">
        <h2>Issue {number}</h2>
        <p> <span style={{ fontWeight: 'bold' }}>Description: </span> {issue.title}</p>
        <p><span style={{ fontWeight: 'bold' }}>Author:</span> {issue.user ? issue.user.login : "Unknown"}</p>
        <p><span style={{ fontWeight: 'bold' }}>Labels:</span></p>
        {issue.labels && issue.labels.length > 0 ? (
          <ul>
            {issue.labels.map((label) => (
              <li key={label.id}>{label.name}</li>
            ))}
          </ul>
        ) : (
          <p className="no-labels">No labels available.</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button>
            <Link to="/" className="back-to-home">Back to Home</Link>
          </button>
        </div>
      </div>

    </>
  );
}

export default App;
