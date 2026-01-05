import React from "react"
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Leaf,
  FileText,
  HelpCircle,
  ScrollText,
  RotateCcw,
  Info
} from "lucide-react"

const contentPages = [
  { title: "About Us", icon: Info },
  { title: "Safety Guidelines", icon: ShieldCheck },
  { title: "Green Crackers Policy", icon: Leaf },
  { title: "Government Regulations", icon: ScrollText },
  { title: "FAQs", icon: HelpCircle },
  { title: "Privacy Policy", icon: FileText },
  { title: "Terms & Conditions", icon: FileText },
  { title: "Refund & Cancellation Policy", icon: RotateCcw },
]

const Contact = () => {
  return (
    <section className="pt-32 pb-24 bg-[#F8FAFC] font-poppins">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Contact & Information
          </h1>
          <p className="text-lg text-gray-600">
            Reach out to us for orders, delivery queries, safety guidelines
            or any information related to our policies.
          </p>
        </div>

        {/* CONTACT + FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-24">

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-[#1E60F2]" />
              <p className="text-gray-700">
                Himalaya Crackers,<br />
                Sivakasi, Tamil Nadu – 626123
              </p>
            </div>

            <div className="flex items-center gap-4">
              <PhoneCall className="text-[#F2A31E]" />
              <p className="text-gray-700">+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-[#1E60F2]" />
              <p className="text-gray-700">support@himalayacrackers.com</p>
            </div>

            <p className="text-sm text-gray-500 max-w-md">
              Our team is available to assist you with product selection,
              bulk orders, delivery areas and compliance-related questions.
            </p>
          </div>

          {/* CONTACT FORM */}
          <form className="bg-white p-8 rounded-3xl shadow-lg space-y-6">
            <h3 className="text-xl font-black text-gray-900">
              Send us a message
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E60F2]"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E60F2]"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E60F2]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#1E60F2] text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Submit Enquiry
            </button>
          </form>
        </div>

        {/* CONTENT PAGES GRID */}
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-10">
            Important Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentPages.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E60F2]/10">
                    <Icon className="text-[#1E60F2]" />
                  </div>
                  <p className="font-bold text-gray-800">
                    {item.title}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* SUPPORT NOTE */}
        <div className="mt-20 p-6 bg-blue-50 rounded-2xl text-sm text-gray-700 max-w-4xl">
          ℹ️ For policy-related clarifications, government compliance,
          safety instructions or bulk order documentation,
          please contact us before placing your order.
        </div>

      </div>
    </section>
  )
}

export default Contact
