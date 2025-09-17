import React from 'react';
import { ArrowLeft, Mail, Linkedin, Github } from 'lucide-react';

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
      <div className="mx-auto px-4 py-16" style={{ maxWidth: '2000px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Text Content */}
          <div className="space-y-10 text-left">
            <div className="space-y-6">
              <h1 className="text-teal-400 text-xl font-medium">
                Hi I'm Eric. I'm a Creative Director and Learning Experience Designer.
              </h1>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-yellow-400 text-2xl font-semibold mb-6">
                  About Character Studio
                </h3>
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Character Studio was born from my passion for creating compelling characters in Articulate Storyline. Over the years, I've built hundreds of scenario activities, branching simulations, and interactive learning experiences. Each project required unique characters that could convey emotion, personality, and authenticity.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    I found myself constantly searching for the perfect character images - ones that matched the tone, style, and diversity needed for modern learning experiences. Traditional stock photos felt generic and disconnected from the learning context. That's when I realized there had to be a better way.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Character Studio leverages AI to transform any reference photo into custom characters across multiple art styles and poses. Whether you need professional business characters, diverse learners, or stylized illustrations, Character Studio helps you create the perfect characters for your learning scenarios.
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
                  href="https://github.com/ericberget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-96 h-[500px] bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <img 
                  src="/images/about-me.jpg" 
                  alt="Eric Berget" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-teal-400 rounded-full opacity-20"></div>
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
