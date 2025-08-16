import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useSupernaturalStore, Race, LookingFor } from "@/store/supernaturalStore";
import { toast } from "@/hooks/use-toast";
import { Camera, ArrowLeft, ImageIcon, User, Sparkles } from "lucide-react";

const PhotoGallery = ({ onSelectPhoto, isOpen, onClose }: {
  onSelectPhoto: (photo: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const supernaturalPhotos = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural1&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural2&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural3&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural4&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural5&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural6&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural7&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural8&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=supernatural9&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-mystical" />
            Escolha sua foto de perfil
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {supernaturalPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectPhoto(photo);
                onClose();
                toast({
                  title: "Foto selecionada!",
                  description: "Sua foto de perfil foi atualizada",
                });
              }}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-border/30 hover:border-mystical/50 transition-all duration-300 transform hover:scale-105"
            >
              <img 
                src={photo} 
                alt={`Avatar ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-mystical/0 group-hover:bg-mystical/20 transition-all duration-300 flex items-center justify-center">
                <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [race, setRace] = useState<Race | "">("");
  const [family, setFamily] = useState("");
  const [isFromFamily, setIsFromFamily] = useState<boolean | null>(null);
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  const navigate = useNavigate();
  const { createUser } = useSupernaturalStore();

  const handleCreateAccount = () => {
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Digite seu nome de usuário",
        variant: "destructive"
      });
      return;
    }

    if (!age) {
      toast({
        title: "Erro",
        description: "Selecione sua idade",
        variant: "destructive"
      });
      return;
    }

    if (!race) {
      toast({
        title: "Erro",
        description: "Selecione sua raça",
        variant: "destructive"
      });
      return;
    }

    if (isFromFamily === null) {
      toast({
        title: "Erro",
        description: "Selecione se você é de uma família",
        variant: "destructive"
      });
      return;
    }

    if (!lookingFor) {
      toast({
        title: "Erro",
        description: "Selecione o que você busca",
        variant: "destructive"
      });
      return;
    }

    if (!about.trim()) {
      toast({
        title: "Erro",
        description: "Escreva algo sobre você",
        variant: "destructive"
      });
      return;
    }

    const userData = {
      username,
      age,
      race: race as Race,
      family: isFromFamily ? family : undefined,
      lookingFor: lookingFor as LookingFor,
      about,
      avatar
    };

    createUser(userData);
    
    toast({
      title: "✨ Conta criada com sucesso!",
      description: `Bem-vindo ao mundo sobrenatural, ${username}!`
    });

    navigate('/app');
  };

  const ageOptions = [
    ...Array.from({ length: 83 }, (_, i) => i + 18),
    '+100'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-border/50">
        <CardHeader className="text-center relative">
          <Button 
            variant="glass" 
            onClick={() => navigate('/auth')}
            className="absolute left-0 top-0 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="space-y-2">
            <Sparkles className="h-8 w-8 mx-auto text-mystical floating-animation" />
            <CardTitle className="text-2xl gradient-mystical bg-clip-text text-transparent">
              Criar Conta Sobrenatural
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure seu perfil místico
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Modern Avatar Selection */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-mystical/30 mystical-glow">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-mystical/20 gradient-mystical">
                  <User className="h-12 w-12 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Button 
                  variant="mystical" 
                  size="sm"
                  onClick={() => setShowPhotoGallery(true)}
                  className="rounded-full h-10 w-10 p-0 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="glass" 
              size="sm"
              onClick={() => setShowPhotoGallery(true)}
              className="font-medium"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Escolher da Galeria
            </Button>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Nome de usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu nome sobrenatural"
              className="modern-blur border-border/50 focus:border-mystical/50"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">Idade</Label>
            <Select onValueChange={(value) => setAge(value === '+100' ? 100 : parseInt(value))}>
              <SelectTrigger className="modern-blur border-border/50 focus:border-mystical/50">
                <SelectValue placeholder="Selecione sua idade" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50 max-h-60">
                {ageOptions.map((ageOption) => (
                  <SelectItem key={ageOption} value={ageOption.toString()}>
                    {ageOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Race */}
          <div className="space-y-2">
            <Label htmlFor="race" className="text-sm font-medium">Raça Sobrenatural</Label>
            <Select onValueChange={(value) => setRace(value as Race)}>
              <SelectTrigger className="modern-blur border-border/50 focus:border-mystical/50">
                <SelectValue placeholder="Selecione sua raça" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                <SelectItem value="Draeven">🐉 Draeven</SelectItem>
                <SelectItem value="Sylven">🧚 Sylven</SelectItem>
                <SelectItem value="Lunari">🌙 Lunari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Family */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Linhagem Familiar</Label>
            <div className="space-y-2">
              <Button
                variant={isFromFamily === true ? "mystical" : "glass"}
                onClick={() => setIsFromFamily(true)}
                className="w-full justify-start h-auto p-3"
                size="sm"
              >
                <div className="text-left">
                  <p className="font-medium">Sou de uma família</p>
                  <p className="text-xs opacity-80">Possuo uma linhagem ancestral</p>
                </div>
              </Button>
              
              {isFromFamily === true && (
                <Input
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                  placeholder="Nome da família (ex: Casa dos Corvos)"
                  className="modern-blur border-border/50 focus:border-mystical/50 ml-4"
                />
              )}
              
              <Button
                variant={isFromFamily === false ? "mystical" : "glass"}
                onClick={() => {
                  setIsFromFamily(false);
                  setFamily("");
                }}
                className="w-full justify-start h-auto p-3"
                size="sm"
              >
                <div className="text-left">
                  <p className="font-medium">Não sou de família</p>
                  <p className="text-xs opacity-80">Sou um ser independente</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Looking for */}
          <div className="space-y-2">
            <Label htmlFor="lookingFor" className="text-sm font-medium">O que você busca</Label>
            <Select onValueChange={(value) => setLookingFor(value as LookingFor)}>
              <SelectTrigger className="modern-blur border-border/50 focus:border-mystical/50">
                <SelectValue placeholder="Selecione suas preferências" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                <SelectItem value="Draeven">🐉 Draeven</SelectItem>
                <SelectItem value="Sylven">🧚 Sylven</SelectItem>
                <SelectItem value="Lunari">🌙 Lunari</SelectItem>
                <SelectItem value="Todos">✨ Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about" className="text-sm font-medium">Sobre sua essência</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Descreva sua aura, poderes ou o que torna você único no mundo sobrenatural..."
              className="modern-blur border-border/50 focus:border-mystical/50 min-h-24 resize-none"
            />
          </div>

          <Button 
            onClick={handleCreateAccount}
            className="w-full h-12 text-lg font-semibold"
            variant="mystical"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Despertar no Mundo Sobrenatural
          </Button>
        </CardContent>
      </Card>

      <PhotoGallery 
        onSelectPhoto={setAvatar}
        isOpen={showPhotoGallery}
        onClose={() => setShowPhotoGallery(false)}
      />
    </div>
  );
};

export default CreateAccount;