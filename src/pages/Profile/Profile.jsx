import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";
import useAuthStore from "../../store/useAuthStore";
import {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  followUser,
  unfollowUser,
  getFollowStatus,
} from "../../services/userService";
import toast from "react-hot-toast";

const StarDisplay = ({ rating }) => (
  <span className="text-yellow-400 text-sm">
    {"★".repeat(Math.round(rating / 2))}{"☆".repeat(5 - Math.round(rating / 2))}
    <span className="text-gray-400 ml-1">{rating}/10</span>
  </span>
);

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateUserProfile(user.id, {
        ...form,
        updatedAt: new Date().toISOString()
      });
      toast.success("Cập nhật thành công");
      onSave(updated);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-9999 flex items-center justify-center px-4">
      <div className="bg-[#1b1d29] rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white text-xl font-bold">Chỉnh sửa hồ sơ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Tên người dùng</label>
            <input
              className="w-full bg-[#22242c] text-white rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-mainblue text-sm"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Username"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Tiểu sử (tối đa 50 ký tự)</label>
            <textarea
              className="w-full bg-[#22242c] text-white rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-mainblue text-sm resize-none h-20"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 50) }))}
              placeholder="Giới thiệu bản thân..."
              maxLength={50}
            />
            <span className="text-gray-600 text-xs">{form.bio.length}/50</span>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">URL ảnh đại diện</label>
            <input
              className="w-full bg-[#22242c] text-white rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-mainblue text-sm"
              value={form.avatarUrl}
              onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-mainblue text-white rounded-lg py-2.5 font-medium hover:opacity-80 disabled:opacity-50 text-sm"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white rounded-lg py-2.5 font-medium hover:opacity-80 text-sm"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Profile() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const currentUserId = currentUser?.id || currentUser?.userId;

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isOwnProfile = currentUserId && Number(id) === currentUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(id);
        setProfile(data);
      } catch {
        toast.error("Không tìm thấy người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || isOwnProfile) return;
    getFollowStatus(id).then(data => setFollowing(data.following)).catch(() => {});
  }, [id, isAuthenticated, isOwnProfile]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await getUserReviews(id, reviewPage, 6);
        setReviews(prev => reviewPage === 1 ? data.data : [...prev, ...data.data]);
        setReviewTotal(data.total);
      } catch {
        toast.error("Lỗi tải đánh giá");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id, reviewPage]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để theo dõi");
      return;
    }
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(id);
        setFollowing(false);
        setProfile(p => p ? { ...p, followerCount: p.followerCount - 1 } : p);
        toast.success("Đã bỏ theo dõi");
      } else {
        await followUser(id);
        setFollowing(true);
        setProfile(p => p ? { ...p, followerCount: p.followerCount + 1 } : p);
        toast.success("Đã theo dõi");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#1b1d29] pt-24 px-4 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-700"></div>
            <div className="h-6 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#1b1d29] pt-24 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <i className="fa-solid fa-user-slash text-5xl mb-4 block"></i>
            <p>Không tìm thấy người dùng</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1b1d29] pt-20">

        {/* Banner */}
        <div className="h-48 bg-gradient-to-br from-mainblue/40 to-purple-900/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0f111a]/60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1b1d29]"></div>
        </div>

        {/* Profile Section */}
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-4 border-[#1b1d29] overflow-hidden flex-shrink-0 bg-mainblue flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {profile.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-white text-2xl font-bold">{profile.username}</h1>
              {profile.bio && <p className="text-gray-400 text-sm mt-1">{profile.bio}</p>}
              <div className="flex gap-6 mt-2 text-sm text-gray-400">
                <span><strong className="text-white">{profile.reviewCount}</strong> đánh giá</span>
                <span><strong className="text-white">{profile.followerCount}</strong> người theo dõi</span>
                <span><strong className="text-white">{profile.followingCount}</strong> đang theo dõi</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pb-2">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEdit(true)}
                  className="bg-[#22242c] border border-gray-700 text-white rounded-lg px-4 py-2 text-sm font-medium hover:border-mainblue transition-colors"
                >
                  <i className="fa-solid fa-pen mr-2"></i>
                  Chỉnh sửa hồ sơ
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                    following
                      ? "bg-[#22242c] border border-gray-700 text-white hover:border-red-500 hover:text-red-400"
                      : "bg-mainblue text-white hover:opacity-80"
                  }`}
                >
                  {followLoading ? "..." : following ? "Đang theo dõi" : "Theo dõi"}
                </button>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pb-20">
            <h2 className="text-white text-xl font-bold mb-5">
              Đánh giá gần đây
              <span className="text-gray-500 text-base font-normal ml-2">({reviewTotal})</span>
            </h2>

            {reviewsLoading && reviews.length === 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-[#22242c] rounded-2xl p-4 animate-pulse">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-18 bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <i className="fa-regular fa-star text-5xl mb-4 block"></i>
                <p>{isOwnProfile ? "Bạn chưa có đánh giá nào" : "Người dùng này chưa có đánh giá nào"}</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  {reviews.map(review => (
                    <Link
                      key={review.id}
                      to={`/movie/${review.movieId}`}
                      className="bg-[#22242c] rounded-2xl p-4 hover:bg-[#2a2c38] transition-colors block"
                    >
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-white font-semibold text-sm truncate">
                              {review.movieTitle}
                            </span>
                            <StarDisplay rating={review.rating} />
                          </div>
                          <p className="text-gray-500 text-sm font-medium mb-1">{review.title}</p>
                          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                            {review.content}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-gray-600 text-xs">
                            <span><i className="fa-solid fa-heart mr-1"></i>{review.likeCount}</span>
                            <span><i className="fa-solid fa-comment mr-1"></i>{review.commentCount}</span>
                            {review.hasSpoiler && (
                              <span className="text-yellow-700">⚠️ Spoiler</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {reviews.length < reviewTotal && (
                  <button
                    onClick={() => setReviewPage(p => p + 1)}
                    disabled={reviewsLoading}
                    className="w-full mt-6 py-3 text-mainblue text-sm hover:opacity-80 disabled:opacity-50 transition-opacity"
                  >
                    {reviewsLoading ? "Đang tải..." : `Xem thêm (${reviewTotal - reviews.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showEdit && profile && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setProfile(p => ({ ...p, ...updated }))}
        />
      )}

      <Footer />
    </>
  );
}

export default Profile;
