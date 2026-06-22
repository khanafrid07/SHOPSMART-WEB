import { useState, useEffect } from "react";
import BannerRenderer from "../components/BannerRenderer";
import BannerFormFields from "./BannerFormFields";
import { useParams } from "react-router-dom";
import { useGetBannerByIdQuery, useCreateBannerMutation, useUpdateBannerMutation } from "../BannerSlice";
import BannerScheduler from "../components/BannerSchedule";
import { notifyError, notifySuccess } from "../../../utils/notify";
import { useNavigate } from "react-router-dom";

export default function BannerForm() {
  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data, isLoading } = useGetBannerByIdQuery(id, {
    skip: !id,
  });
  ("edit banner", data)
  const [createBanner, { isLoading: creatingBanner }] = useCreateBannerMutation()
  const [updateBanner, { isLoading: updatingBanner }] = useUpdateBannerMutation()
  const [form, setForm] = useState({
    title: "",
    heading: "",
    subHeading: "",
    image: "",
    ctaText: "",
    ctaLink: "",
    template: "hero_dark",
    placement: "home_top",
    type: "promo",
    category: "",
    schedule: { startDate: undefined, endDate: undefined },
    isActive: true,
    preview: null
  });

  useEffect(() => {
    if (data) {
      const b = data;

      setForm({
        title: b.title || "",
        subHeading: b.subHeading || "",
        heading: b.heading || "",
        image: b.image || "",
        ctaText: b.ctaText || "",
        ctaLink: b.ctaLink || "",
        template: b.template || "hero_dark",
        placement: b.placement || "home_top",
        type: b.type || "promo",
        category: b.category || "",
        isActive: b.isActive ?? true,
        preview: null,
        schedule: b.schedule ?? { startDate: undefined, endDate: undefined }
      });
    }
    console.log(form.image, "img baner")
  }, [data]);
  useEffect(() => {
    if (!form.preview) return;


    return () => {
      URL.revokeObjectURL(form.preview);

    };
  }, [form.preview]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageUpload(file) {
    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  }
  function handleScheduleChange(e) {
    setForm((prev) => ({
      ...prev, schedule: { ...prev.schedule, [e.target.name]: e.target.value }
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("heading", form.heading);
    formData.append("subHeading", form.subHeading);
    formData.append("ctaText", form.ctaText);
    formData.append("ctaLink", form.ctaLink);
    formData.append("template", form.template);
    formData.append("placement", form.placement);
    formData.append("type", form.type);
    formData.append("category", form.category);
    formData.append("isActive", form.isActive);
    formData.append("schedule", JSON.stringify(form.schedule));


    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    if (isEdit) {
      try {
        await updateBanner({ id, formData }).unwrap()
        notifySuccess("Banner updated success")
        navigate("/dashboard/banners")

      } catch (err) {
        notifyError("error updating banner", err)
          (err)
      }
    } else {
      try {

        await createBanner(formData).unwrap()
        notifySuccess("Banner created success")
        navigate("/dashboard/banners")
      } catch (err) {
        notifyError("error creating banner")

      }
    }
  }
  if (isLoading) return <p>Loading</p>

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* LEFT: FORM */}



      <div className=" space-y-3">
        <h2 className="text-lg font-semibold">Live Preview</h2>

        <div className="rounded-2xl overflow-hidden border bg-base-200 ">
          <BannerRenderer
            banner={{
              ...form,
              image:
                form.preview || form.image ||
                "https://via.placeholder.com/1200x600?text=Preview",
            }}
          />
        </div>
        {/* <div>
          <BannerScheduler form={form} handleChange={handleScheduleChange} />

        </div> */}
      </div>
      <BannerFormFields
        form={form}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        isLoading={isLoading}
        creatingBanner={creatingBanner}
        updatingBanner={updatingBanner}
      />
    </div>
  );
}