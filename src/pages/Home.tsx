import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Moon, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 text-mystical opacity-40 floating-animation" size={32} />
        <Moon className="absolute top-32 right-32 text-celestial opacity-50 floating-animation" size={40} style={{animationDelay: '2s'}} />
        <Star className="absolute bottom-40 left-40 text-ethereal opacity-45 floating-animation" size={28} style={{animationDelay: '4s'}} />
        <Sparkles className="absolute bottom-20 right-20 text-mystical opacity-35 floating-animation" size={36} style={{animationDelay: '6s'}} />
        <Star className="absolute top-1/2 left-10 text-celestial opacity-30 floating-animation" size={24} style={{animationDelay: '1s'}} />
        <Moon className="absolute bottom-1/3 right-10 text-ethereal opacity-40 floating-animation" size={28} style={{animationDelay: '3s'}} />
      </div>
      
      {/* Main content with modern design */}
      <div className="text-center space-y-12 z-10 max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-black gradient-mystical bg-clip-text text-transparent tracking-tight">
              TINDER
            </h1>
            <div className="absolute inset-0 text-7xl md:text-9xl font-black text-mystical/10 blur-xl">
              TINDER
            </div>
          </div>
          
          <div className="relative">
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text gradient-celestial tracking-wide">
              SOBRENATURAL
            </h2>
            <div className="absolute inset-0 text-5xl md:text-7xl font-black text-celestial/10 blur-xl">
              SOBRENATURAL
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border-border/30 max-w-lg mx-auto">
            <p className="text-xl text-foreground/90 font-medium leading-relaxed">
              Encontre sua <span className="text-mystical font-bold">alma gêmea</span> entre as criaturas místicas
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              O primeiro app de relacionamento sobrenatural do mundo
            </p>
          </div>
        </div>
        
        <div className="pt-8">
          <Button 
            variant="mystical" 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-2xl px-16 py-8 h-auto font-bold tracking-wide rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            INICIAR JORNADA
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4 font-medium">
            ✨ Draevens • 🧚 Sylvens • 🌙 Lunaris
          </p>
        </div>
      </div>
      
      {/* Enhanced background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-mystical rounded-full opacity-5 blur-3xl floating-animation"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 gradient-celestial rounded-full opacity-5 blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
    </div>
  );
};

export default Home;