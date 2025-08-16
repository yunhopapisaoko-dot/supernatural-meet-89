import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSupernaturalStore } from "@/store/supernaturalStore";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Shield, Users } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { users, deleteUser } = useSupernaturalStore();

  const handleDeleteUser = (userId: string, username: string) => {
    deleteUser(userId);
    toast({
      title: "Usuário deletado",
      description: `${username} foi removido do sistema`,
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/auth')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-mystical" />
            <h1 className="text-2xl font-bold gradient-mystical bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
        </div>

        <Card className="gradient-card card-glow border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários Cadastrados ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum usuário cadastrado ainda
              </p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/20">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.race} • {user.age} anos
                        </p>
                        {user.family && (
                          <p className="text-xs text-celestial">
                            Família: {user.family}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Busca: {user.lookingFor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Criado em:</p>
                        <p>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;