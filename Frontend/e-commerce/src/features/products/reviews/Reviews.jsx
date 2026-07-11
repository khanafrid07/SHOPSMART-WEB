import { useCreateReviewsMutation } from "./reviewSlice";
import { useState } from "react";
import { useParams } from "react-router";
import Alert from "../../../components/Alert";
import { Star } from "lucide-react";
import { notifyError, notifySuccess } from "../../../utils/notify";
import AverageRating from "./AverageRating";
export default function Reviews({ reviews, refetch }) {
  const [createReviews, { isLoading }] = useCreateReviewsMutation();
  const { id } = useParams();

  const [alert, setAlert] = useState({ message: "", type: "success" });

  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    productId: id,
  });

  const [hover, setHover] = useState(0);

  const [page, setPage] = useState(0);
  const reviewsPerPage = 4;

  function onReviewChange(e) {
    setReview((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!review.rating) {
        notifyError("Please select a rating")
        return
      }
      const response = await createReviews(review).unwrap();

      notifySuccess(response?.message)
      refetch()

      setReview({ rating: 0, comment: "", productId: id });
    } catch (err) {
      (err, "err")
      const fieldErrors = err?.data?.errors?.fieldErrors || {};
      Object.values(fieldErrors).forEach((error) => {
        error.forEach((error) => {
          notifyError(error)
        })
      })
      // notifyError(err?.data?.message || "Error adding review")
    }
  }

  const startIndex = page * reviewsPerPage;
  const currentReviews = reviews?.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  return (
    <div className="w-full max-w-5xl px-3 mx-auto py-10 space-y-8">

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Reviews & Ratings
        </h3>
        <p className="text-gray-500 text-sm">
          Share your experience with this product
        </p>
      </div>


      <AverageRating reviews={reviews} />

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl border bg-white/60 backdrop-blur-md shadow-sm space-y-5"
      >
        {/* Star Rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              size={28}
              onMouseEnter={() => setHover(num)}
              onMouseLeave={() => setHover(0)}
              onClick={() =>
                setReview((prev) => ({ ...prev, rating: num }))
              }
              className={`cursor-pointer transition-all duration-200 ${(hover || review.rating) >= num
                ? "fill-yellow-400 text-yellow-400 scale-110"
                : "text-gray-300"
                }`}
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          name="comment"
          value={review.comment}
          onChange={onReviewChange}
          placeholder="Write your honest thoughts..."
          className="w-full p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black/10 resize-none text-sm"
        />

        {/* Submit */}
        <button
          disabled={isLoading}
          type="submit"
          className="px-6 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
        >
          {isLoading ? "Posting..." : "Post Review"}
        </button>
      </form>

      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "" })}
      />

      {/* Reviews List */}
      <div className="grid md:grid-cols-2 gap-6">
        {currentReviews?.map((rev) => (
          <div
            key={rev._id}
            className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* User */}
            <p className="font-semibold text-sm mb-2">
              {rev.username}
            </p>

            {/* Stars */}
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={18}
                  className={
                    num <= rev.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <button
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <button
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
          disabled={startIndex + reviewsPerPage >= reviews.length}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}