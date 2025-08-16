import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSupernaturalStore } from "@/store/supernaturalStore";
import { toast } from "@/hooks/use-toast";
import { Shield, Users, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useSupernaturalStore();

  const handleLogin = () => {
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Digite seu nome de usuário",
        variant: "destructive"
      });
      return;
    }

    const user = login(username);
    if (user) {
      toast({
        title: "Bem-vindo!",
        description: `Olá, ${user.username}!`
      });
      navigate('/app');
    } else {
      toast({
        title: "Usuário não encontrado",
        description: "Crie uma conta primeiro",
        variant: "destructive"
      });
    }
  };

  const handleAdminAccess = () => {
    if (adminPassword === "88620787") {
      navigate('/admin');
    } else {
      toast({
        title: "Senha incorreta",
        description: "Acesso negado",
        variant: "destructive"
      });
      setAdminPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-border/50">
        <CardHeader className="text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto gradient-mystical rounded-full flex items-center justify-center floating-animation">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl gradient-mystical bg-clip-text text-transparent">
              Acesso Sobrenatural
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Entre no mundo das criaturas místicas
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showAdminInput ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome sobrenatural"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="modern-blur border-border/50 focus:border-mystical/50 h-12"
                />
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full h-12 font-semibold"
                variant="mystical"
              >
                Entrar no Reino
              </Button>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/create-account')}
                  variant="glass"
                  className="w-full h-12 font-medium"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Despertar como Criatura
                </Button>

                <Button 
                  onClick={() => setShowAdminInput(true)}
                  variant="ghost"
                  className="w-full h-12 font-medium"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Portal Administrativo
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto gradient-celestial rounded-full flex items-center justify-center pulse-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-mystical">Portal Administrativo</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesso restrito aos Guardiões
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Senha dos Guardiões</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                  className="modern-blur border-border/50 focus:border-mystical/50 h-12"
                />
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleAdminAccess}
                  className="w-full h-12 font-semibold"
                  variant="mystical"
                >
                  Acessar Portal
                </Button>

                <Button 
                  onClick={() => {
                    setShowAdminInput(false);
                    setAdminPassword("");
                  }}
                  variant="glass"
                  className="w-full h-12 font-medium"
                >
                  Voltar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;