import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
} from "../../../../services/reviewService";
import toast from "react-hot-toast";

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-lg transition-colors ${
            star <= (hovered || value)
              ? "text-yellow-400"
              : "text-gray-600"
          } ${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review, movieId, currentUserId, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(review.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: review.title,
    content: review.content,
    rating: review.rating,
    hasSpoiler: review.hasSpoiler,
  });

  const isOwner = currentUserId && currentUserId === review.userId;

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Bạn cần đăng nhập để thích đánh giá");
      return;
    }
    try {
      const res = await toggleLike(movieId, review.id);
      setLiked(res.liked);
      setLikeCount(prev => res.liked ? prev + 1 : prev - 1);
    } catch {
      toast.error("Lỗi khi thích đánh giá");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateReview(movieId, review.id, editData);
      onUpdate(updated);
      setEditing(false);
      toast.success("Cập nhật đánh giá thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await deleteReview(movieId, review.id);
      onDelete(review.id);
      toast.success("Đã xóa đánh giá");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi xóa đánh giá");
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="bg-[#22242c] rounded-2xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-mainblue flex items-center justify-center text-white font-bold text-sm">
            {review.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{review.username}</div>
            <div className="text-gray-500 text-xs">{timeAgo(review.createdAt)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} readonly />
          <span className="text-yellow-400 font-bold text-sm">{review.rating}/10</span>
          {review.isEdited && <span className="text-gray-600 text-xs italic">(đã sửa)</span>}
        </div>
      </div>

      {/* Spoiler warning */}
      {review.hasSpoiler && (
        <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-xs px-3 py-1 rounded mb-2">
          ⚠️ Cảnh báo spoiler
        </div>
      )}

      {editing ? (
        <form onSubmit={handleEdit} className="flex flex-col gap-3 mt-2">
          <input
            className="bg-[#1b1d29] text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-mainblue"
            value={editData.title}
            onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
            placeholder="Tiêu đề"
            required
          />
          <textarea
            className="bg-[#1b1d29] text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-mainblue resize-none h-24"
            value={editData.content}
            onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
            placeholder="Nội dung đánh giá"
            required
          />
          <StarRating value={editData.rating} onChange={v => setEditData(d => ({ ...d, rating: v }))} />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-spoiler"
              checked={editData.hasSpoiler}
              onChange={e => setEditData(d => ({ ...d, hasSpoiler: e.target.checked }))}
              className="accent-mainblue"
            />
            <label htmlFor="edit-spoiler" className="text-gray-400 text-sm">Chứa spoiler</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-mainblue text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:opacity-80">
              Lưu
            </button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-700 text-white rounded-lg px-4 py-1.5 text-sm hover:opacity-80">
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="text-white font-semibold mb-1">{review.title}</div>
          <div className="text-gray-400 text-sm leading-relaxed">{review.content}</div>
        </>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/50">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-colors ${
              liked ? "text-pink-500" : "text-gray-500 hover:text-pink-400"
            }`}
          >
            <i className="fa-solid fa-heart"></i>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-comment"></i>
            <span>{review.commentCount}</span>
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors ml-auto"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const WriteReviewForm = ({ movieId, onSuccess, existingReview }) => {
  const [form, setForm] = useState({
    title: existingReview?.title || "",
    content: existingReview?.content || "",
    rating: existingReview?.rating || 7,
    hasSpoiler: existingReview?.hasSpoiler || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setLoading(true);
      const result = existingReview
        ? await updateReview(movieId, existingReview.id, form)
        : await createReview(movieId, form);
      toast.success(existingReview ? "Cập nhật thành công" : "Đăng đánh giá thành công");
      onSuccess(result, !!existingReview);
      if (!existingReview) setForm({ title: "", content: "", rating: 7, hasSpoiler: false });
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#22242c] rounded-2xl p-4 mb-6">
      <h3 className="text-white font-semibold mb-3 text-base">
        {existingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá của bạn"}
      </h3>

      <input
        className="w-full bg-[#1b1d29] text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-mainblue mb-3"
        placeholder="Tiêu đề đánh giá"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        required
      />

      <textarea
        className="w-full bg-[#1b1d29] text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-mainblue resize-none h-28 mb-3"
        placeholder="Nội dung đánh giá..."
        value={form.content}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
        required
      />

      <div className="flex flex-wrap items-center gap-4 mb-3">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs">Điểm ({form.rating}/10)</span>
          <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasSpoiler"
            checked={form.hasSpoiler}
            onChange={e => setForm(f => ({ ...f, hasSpoiler: e.target.checked }))}
            className="accent-mainblue"
          />
          <label htmlFor="hasSpoiler" className="text-gray-400 text-sm">Chứa spoiler</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-mainblue text-white rounded-lg px-5 py-2 text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Đang đăng..." : (existingReview ? "Cập nhật" : "Đăng đánh giá")}
      </button>
    </form>
  );
};

function ReviewsTab({ movieId }) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  const currentUserId = user?.id || user?.userId;

  const hasUserReviewed = reviews.some(r => r.userId === currentUserId);

  const fetchReviews = useCallback(async (p = 1) => {
    if (!movieId) return;
    setLoading(true);
    try {
      const data = await getMovieReviews(movieId, p, pageSize);
      setReviews(p === 1 ? data.data : prev => [...prev, ...data.data]);
      setTotal(data.total);
      setPage(p);
    } catch {
      toast.error("Lỗi tải đánh giá");
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleReviewSuccess = (newReview, isUpdate) => {
    if (isUpdate) {
      setReviews(prev => prev.map(r => r.id === newReview.id ? newReview : r));
    } else {
      setReviews(prev => [newReview, ...prev]);
      setTotal(t => t + 1);
    }
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    setTotal(t => t - 1);
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-bold">
          Đánh giá <span className="text-gray-500 text-base font-normal">({total})</span>
        </h2>
      </div>

      {/* Write review form */}
      {isAuthenticated && !hasUserReviewed && (
        <WriteReviewForm movieId={movieId} onSuccess={handleReviewSuccess} />
      )}

      {/* Reviews list */}
      {loading && reviews.length === 0 ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#22242c] rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-700"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-regular fa-comment text-4xl mb-3 block"></i>
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <>
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              movieId={movieId}
              currentUserId={currentUserId}
              onUpdate={r => handleReviewSuccess(r, true)}
              onDelete={handleReviewDelete}
            />
          ))}

          {reviews.length < total && (
            <button
              onClick={() => fetchReviews(page + 1)}
              disabled={loading}
              className="w-full py-3 text-mainblue text-sm hover:opacity-80 transition-opacity"
            >
              {loading ? "Đang tải..." : `Xem thêm (${total - reviews.length} đánh giá)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewsTab;
