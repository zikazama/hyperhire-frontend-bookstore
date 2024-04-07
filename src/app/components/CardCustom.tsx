"use client";

import { Button, Card, Modal } from "flowbite-react";
import { useState } from "react";
import BASE_URL from "../config";
import Swal from "sweetalert2";

export default function CardCustom(props: any) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Card
      className="max-w-sm"
      imgAlt="Apple Watch Series 7 in colors pink, silver, and black"
      imgSrc={props?.book.coverImage}
    >
      <a href="#">
        <h4 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {props?.book.title}
        </h4>
        <h5 className="text-xl font-semibold tracking-tight text-gray-300 dark:text-white">
          by {props?.book.writer}
        </h5>
        <h5 className="text-xl font-semibold tracking-tight text-blue-300 dark:text-white">
          tag: {props?.book.tag}
        </h5>
      </a>

      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {props?.book.price} points
        </span>
        <button
          onClick={() => setOpenModal(true)}
          className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
        >
          Buy
        </button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Are you sure want to buy ?</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Your point will be charged based on book price.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                const token = localStorage.getItem("token");
                fetch(`${BASE_URL}/api/orders`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: JSON.stringify(JSON.parse(token ?? "")).replaceAll(
                      '"',
                      ""
                    ),
                  },
                  body: JSON.stringify({
                    bookId: props.book.id,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.message) {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: data.message,
                      });
                    }
                    if (data.id) {
                      Swal.fire({
                        title: "Success!",
                        icon: "success",
                      });
                      window.location.reload();
                    }
                  })
                  .catch((error) =>
                    console.error("Error fetching data:", error)
                  );
                setOpenModal(false);
              }}
            >
              Sure
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Card>
  );
}
