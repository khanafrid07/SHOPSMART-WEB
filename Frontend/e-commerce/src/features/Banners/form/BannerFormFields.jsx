import {
  Image,
  Layers,
  Link as LinkIcon,
  Type,
} from "lucide-react";

export default function BannerFormFields({
  form,
  onChange,
  onImageUpload,
  onSubmit,
  isEdit,
  isLoading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          {isEdit ? "Edit Banner" : "Create Banner"}
        </h2>
        <p className="text-sm text-gray-500">
          Create and manage promotional banners
        </p>

        {isLoading && (
          <p className="text-xs text-blue-500 mt-1">Loading banner...</p>
        )}
      </div>

      {/* CONTENT */}
      <div className="card bg-base-100 shadow p-5">
        <h3 className="font-semibold flex items-center gap-2">
          <Type size={16} /> Content
        </h3>
        <div className="gap-4 grid grid-cols-2">


          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Banner Title *</span>
            </label>
            <input
              name="title"
              value={form.title || ""}
              onChange={onChange}
              className="input input-bordered w-full"

            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Heading</span>
            </label>
            <input
              name="heading"
              value={form.heading || ""}
              onChange={onChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Subheading */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Sub Heading</span>
            </label>
            <input
              name="subHeading"
              value={form.subHeading || ""}
              onChange={onChange}
              className="input input-bordered w-full"
            />
          </div>

        </div>
      </div>

      {/* IMAGE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">

          <h3 className="font-semibold flex items-center gap-2">
            <Image size={16} /> Image
          </h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Banner Image *</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => onImageUpload(e.target.files[0])}
            />
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="card bg-base-100 shadow p-5">
        <h3 className="font-semibold flex items-center gap-2">
          <LinkIcon size={16} /> CTA
        </h3>
        <div className="gap-4 grid grid-cols-2">


          {/* CTA Text */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">CTA Text</span>
            </label>
            <input
              name="ctaText"
              value={form.ctaText || ""}
              onChange={onChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* CTA Link */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">CTA Link</span>
            </label>
            <input
              name="ctaLink"
              value={form.ctaLink || ""}
              onChange={onChange}
              placeholder="/category/shoes"
              className="input input-bordered w-full"
            />
          </div>

        </div>
      </div>

      {/* SETTINGS */}
      <div className="card bg-base-100 shadow p-5">
        <h3 className="font-semibold flex items-center gap-2">
          <Layers size={16} /> Settings
        </h3>
        <div className="gap-4 grid grid-cols-2">


          {/* TYPE */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Banner Type</span>
            </label>
            <select
              name="type"
              value={form.type || "promo"}
              onChange={onChange}
              className="select select-bordered w-full"
            >
              <option value="hero">Hero Banner</option>
              <option value="promo">Promo Banner</option>
              <option value="category">Category Banner</option>
            </select>
          </div>

          {/* CATEGORY */}
          {form.type === "category" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                value={form.category || ""}
                onChange={onChange}
                className="select select-bordered w-full"
              >
                <option value="" disabled>Select Category</option>
                <option value="fashion">Fashion</option>
                <option value="beauty">Beauty</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
              </select>
            </div>
          )}

          {/* TEMPLATE */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Template</span>
            </label>
            <select
              name="template"
              value={form.template || "clean_image"}
              onChange={onChange}
              className="select select-bordered w-full"
            >
              <option value="clean_image">Clean Image</option>
              <option value="split_banner">Split Banner</option>
              <option value="hero_dark">Hero Dark</option>
              <option value="left_overlay">Left Overlay</option>
              <option value="center_minimal">Center Minimal</option>
              <option value="gradient_promo">Gradient Promo</option>
            </select>
          </div>

          {/* PLACEMENT */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Placement</span>
            </label>
            <select
              name="placement"
              value={form.placement || "home_top"}
              onChange={onChange}
              className="select select-bordered w-full"
            >
              {form.type === "hero" ? (
                <option value="home_top">Home Top</option>
              ) : (
                <>
                  <option value="home_top">Home Top</option>
                  <option value="home_middle">Home Middle</option>
                  <option value="home_bottom">Home Bottom</option>
                </>
              )}
            </select>
          </div>

          {/* ACTIVE */}
          <div className="form-control flex items-center mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">Active</span>
              <input
                type="checkbox"
                name="isActive"
                checked={!!form.isActive}
                onChange={onChange}
                className="toggle toggle-primary"
              />
            </label>
          </div>

        </div>
      </div>

      {/* SUBMIT */}
      <button className="btn btn-primary w-full">
        {isEdit ? "Update Banner" : "Save Banner"}
      </button>

    </form>
  );
}