import CardCustom from "./CardCustom";
import NavbarCustom from "./NavbarCustom";
import BASE_URL from "./../config";
import { useEffect, useRef, useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();
  const [books, setBooks] = useState([]);
  const [profile, setProfile] = useState({
    fullname: null,
    point: null,
  });
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const lastBookRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    search: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 when performing a new search
    fetchBooks(1);
  };

  const fetchBooks = (pageNumber: number) => {
    const query = new URLSearchParams(formData);
    fetch(`${BASE_URL}/api/books?page=${pageNumber}&limit=10&${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (pageNumber === 1) {
          // If fetching first page, replace existing books with new ones
          setBooks(data.rows);
        } else {
          // If fetching subsequent pages, append new books to existing list
          const temp: any = [...books, ...data.rows]; 
          setBooks(temp);
        }
        if (data.rows.length === 0) {
          // No more data available
          setHasMore(false);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      threshold: 0,
    });

    if (lastBookRef.current) {
      observer.observe(lastBookRef.current);
    }

    return () => {
      if (lastBookRef.current) {
        observer.unobserve(lastBookRef.current);
      }
    };
  }, [books]); // Add books to dependencies to trigger observer update when books change

  // Load more on scroll
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]); // Fetch books whenever page changes

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      push("/login");
    } else {
      fetch(`${BASE_URL}/api/profile`, {
        method: "GET",
        headers: {
          Authorization: JSON.parse(token),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            push("/login");
          } else {
            setProfile(data);
          }
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, []);

  return (
    <>
      <NavbarCustom />
      <Card href="#" className="max-w text-center m-10">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, {profile?.fullname} you have {profile?.point} points.
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          You can buy a book that your point can afford.
        </p>
      </Card>
      <form className="flex max-w flex-col gap-4 m-10" onSubmit={handleSubmit}>
        <div>
          <TextInput
            id="search"
            type="text"
            name="search"
            placeholder="Keywords..."
            required
            value={formData.search}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      <div className="grid lg-grid-cols-5 md-grid-cols-2 sm-grid-cols-1 gap-4 m-10">
        {books.map((book: any, index: number) => (
          <CardCustom key={book.id} book={book} />
        ))}
        <div ref={lastBookRef} />
      </div>
    </>
  );
}
