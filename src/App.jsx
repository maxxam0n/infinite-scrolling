import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [error, setError] = useState(null);
  const lastElement = useRef();
  const observer = useRef();

  useEffect(() => {
    async function loadPosts() {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
      );
      const total = response.headers['x-total-count'];
      setTotal(Math.ceil(total / limit));
      setPosts([...posts, ...response.data]);
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        await loadPosts();
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page, limit]);

  useEffect(() => {
    if (isLoading) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < total) {
        setPage(page + 1);
      }
    });

    observer.current.observe(lastElement.current);

    return () => observer.current.disconnect();
  }, [isLoading]);

  return (
    <div className="container">
      <ul>
        {posts.map((post) => {
          return (
            <Card className="my-3" key={post.id}>
              <Card.Body>
                <Card.Title>
                  {post.id}. {post.title}
                </Card.Title>
                <Card.Text>{post.body}</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          );
        })}
        <div ref={lastElement}></div>
        {isLoading && (
          <div className="d-flex justify-content-center py-3">
            <Spinner />
          </div>
        )}
      </ul>
    </div>
  );
}

export default App;
