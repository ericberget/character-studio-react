import React from 'react';
import { ArrowLeft, Mail, Linkedin, Globe } from 'lucide-react';

interface AboutPageProps {
  onBackToStudio: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToStudio }) => {
  return (
    <div className="text-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="mx-auto px-4 py-6" style={{ maxWidth: '2000px' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Studio
            </button>
            <div className="flex-1 flex justify-center">
              <img 
                src="/logo.png" 
                alt="Character Studio" 
                className="h-12 w-auto"
              />
            </div>
            <div className="w-32"></div> {/* Spacer to balance the back button */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-16" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Text Content */}
          <div className="space-y-10 text-left">
            <div className="space-y-6">
              <h1 className="text-teal-400 text-xl font-medium">
                Hi, I'm Eric. I'm an award-winning Director of Creative Learning Experience Design with 13+ years creating custom eLearning that engages, motivates, and delights. I thrive on the challenge of sparking joy in learning through the power of story and dynamic visual design.
              </h1>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-yellow-400 text-2xl font-semibold mb-6">
                  About Character Studio
                </h3>
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Visual impact and compelling storytelling are essential for creating engaging eLearning experiences. Character Studio addresses the challenge of finding consistent, diverse character imagery for interactive learning scenarios.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    This AI-powered tool transforms reference photos into custom characters across multiple art styles and poses, helping learning designers create professional character sets that enhance learner engagement and scenario authenticity.
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Section */}
            <div className="pt-12 border-t border-gray-800">
              <p className="text-gray-300 text-lg mb-6">
                Have feedback or want to connect? 
                <a 
                  href="mailto:eric@characterstudio.ai" 
                  className="text-teal-400 hover:text-teal-300 transition-colors duration-200 ml-1"
                >
                  Contact me here
                </a>
              </p>
              
              <div className="flex gap-4">
                <a
                  href="mailto:eric@characterstudio.ai"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <a
                  href="https://linkedin.com/in/ericberget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href="https://ericberget.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-96 h-[500px] bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <img 
                src="/images/about-me.jpg" 
                alt="Eric Berget" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
            <h3 className="text-yellow-400 text-2xl font-bold mb-8">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">
                  What is Character Studio?
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Character Studio is an AI-powered tool that transforms reference photos into custom characters across multiple art styles and poses. Perfect for eLearning developers, instructional designers, and content creators who need diverse, authentic characters for their projects.
                </p>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">
                  Who is Character Studio for?
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Anyone creating learning content, presentations, or visual materials. Whether you're an Articulate Storyline developer, instructional designer, corporate trainer, or content creator, Character Studio helps you create the perfect characters for your scenarios and stories.
                </p>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">
                  How does it work with Articulate Storyline?
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Simply upload a reference photo, select your desired art style and pose, then download the generated character. Import directly into Storyline as a character state or use as a standalone image. Perfect for creating consistent character sets across your entire course.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
