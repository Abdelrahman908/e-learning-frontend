import React from "react";
import { FaChalkboardTeacher, FaLaptopCode, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaChalkboardTeacher className="text-blue-600 text-5xl mx-auto mb-6" />,
    title: "Expert Instructors",
    description: "Learn from industry experts who are passionate about teaching.",
  },
  {
    icon: <FaLaptopCode className="text-blue-600 text-5xl mx-auto mb-6" />,
    title: "Hands-On Learning",
    description: "Interactive lessons and real-world projects to boost your skills.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-5xl mx-auto mb-6" />,
    title: "Global Community",
    description: "Join a supportive learning community from all over the world.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-16 text-gray-900 drop-shadow-md">
         ? Why Choose Framy
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition duration-300"
            >
              <div>{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
