import { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // UI only — connect to backend later
    console.log("Contact form:", formData);

    setSent(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">

      <section className="contact-header">
        <span className="section-label">
          GET IN TOUCH
        </span>

        <h1>Contact Us</h1>

        <p>
          Have a question or need help? Send us a message
          and we'll get back to you.
        </p>
      </section>

      <section className="contact-layout">

        {/* Info */}
        <div className="contact-info">

          <h2>
            We'd love to hear from you.
          </h2>

          <p>
            Whether you have a question about a product,
            your order, or anything else, feel free to
            contact us.
          </p>

          <div className="contact-info-list">

            <div className="contact-info-item">
              <div className="contact-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>Email</span>
                <strong>support@example.com</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <Phone size={20} />
              </div>

              <div>
                <span>Phone</span>
                <strong>+20 100 000 0000</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>

              <div>
                <span>Location</span>
                <strong>Egypt</strong>
              </div>
            </div>

          </div>

          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-button"
          >
            <MessageCircle size={19} />
            Chat on WhatsApp
          </a>

        </div>

        {/* Form */}
        <div className="contact-form-box">

          {sent && (
            <div className="contact-success">
              Your message has been sent successfully.
            </div>
          )}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-grid">

              <div className="form-group">
                <label htmlFor="contact-name">
                  Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <span className="field-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">
                  Email
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <span className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">
                Subject
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
              />

              {errors.subject && (
                <span className="field-error">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="7"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
              />

              {errors.message && (
                <span className="field-error">
                  {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="contact-submit"
            >
              <Send size={17} />
              Send Message
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Contact;