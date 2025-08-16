import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useSupernaturalStore } from "@/store/supernaturalStore";
import { toast } from "@/hooks/use-toast";
import { Heart, X, Star, LogOut, Bell, BellRing, Check } from "lucide-react";

const NotificationSystem = () => {
  const { getNewMatches, getMatches, markMatchAsRead, users } = useSupernaturalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newMatches, setNewMatches] = useState(getNewMatches());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNewMatches(getNewMatches());
    }, 1000);
    return () => clearInterval(interval);
  }, [getNewMatches]);

  const handleOpenNotifications = () => {
    setIsOpen(true);
  };

  const handleMarkAsRead = (matchId: string) => {
    markMatchAsRead(matchId);
    setNewMatches(getNewMatches());
    toast({
      title: "Notificação lida",
      description: "Match marcado como lido",
    });
  };

  const getMatchUser = (match: any) => {
    const currentUser = useSupernaturalStore.getState().currentUser;
    const otherUserId = match.user1Id === currentUser?.id ? match.user2Id : match.user1Id;
    return users.find(u => u.id === otherUserId);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="glass"
          size="sm"
          onClick={handleOpenNotifications}
          className="relative p-2"
        >
          {newMatches.length > 0 ? (
            <BellRing className="h-5 w-5 text-mystical pulse-glow" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {newMatches.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-mystical text-xs flex items-center justify-center pulse-glow">
              {newMatches.length}
            </Badge>
          )}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BellRing className="h-5 w-5 text-mystical" />
              Notificações de Match
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {newMatches.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma notificação nova</p>
              </div>
            ) : (
              newMatches.map((match) => {
                const matchUser = getMatchUser(match);
                if (!matchUser) return null;
                
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg glass-card border border-mystical/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-mystical/50">
                        <AvatarImage src={matchUser.avatar} />
                        <AvatarFallback className="bg-mystical/20">
                          {matchUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-mystical" />
                          <span className="font-semibold">Novo Match!</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Você e {matchUser.username} se curtiram
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.createdAt).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(match.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(match.id)}
                      className="text-mystical hover:text-mystical/80"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SupernaturalApp = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    getAvailableUsers, 
    likeUser, 
    passUser, 
    superLikeUser, 
    logout,
  } = useSupernaturalStore();

  const [availableUsers, setAvailableUsers] = useState(getAvailableUsers());
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const currentProfileUser = availableUsers[currentUserIndex];

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    setAvailableUsers(getAvailableUsers());
  }, [currentUser, navigate, getAvailableUsers]);

  const handleLike = () => {
    if (!currentProfileUser) return;
    
    const match = likeUser(currentProfileUser.id);
    if (match) {
      toast({
        title: "✨ É um match!",
        description: `Você e ${currentProfileUser.username} se curtiram!`,
      });
    }
    
    nextUser();
  };

  const handlePass = () => {
    if (!currentProfileUser) return;
    
    passUser(currentProfileUser.id);
    nextUser();
  };

  const handleSuperLike = () => {
    if (!currentProfileUser) return;
    
    const match = superLikeUser(currentProfileUser.id);
    if (match) {
      toast({
        title: "⭐ Super Match!",
        description: `${currentProfileUser.username} foi superlikado!`,
      });
    }
    
    nextUser();
  };

  const nextUser = () => {
    const newIndex = currentUserIndex + 1;
    if (newIndex >= availableUsers.length) {
      setAvailableUsers(getAvailableUsers());
      setCurrentUserIndex(0);
    } else {
      setCurrentUserIndex(newIndex);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Até logo!",
      description: "Você foi desconectado",
    });
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-mystical/30">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="bg-mystical/20 gradient-mystical">
              {currentUser.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-bold text-lg">{currentUser.username}</span>
            <p className="text-sm text-muted-foreground">{currentUser.race}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationSystem />
          
          <Button
            variant="glass"
            size="sm"
            onClick={handleLogout}
            className="p-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-md mx-auto">
        {availableUsers.length === 0 ? (
          <Card className="glass-card border-border/50">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto gradient-mystical rounded-full flex items-center justify-center floating-animation">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    Não há mais perfis para mostrar no momento.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Volte mais tarde para ver novos usuários!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : currentProfileUser ? (
          <>
            {/* Modern Profile Card */}
            <div className="relative mb-8">
              <Card className="glass-card border-border/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-[3/4] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80">
                    {currentProfileUser.avatar ? (
                      <img 
                        src={currentProfileUser.avatar} 
                        alt={currentProfileUser.username}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-mystical" />
                    )}
                    
                    {/* Modern overlay with glassmorphism */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="modern-blur rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {currentProfileUser.username}
                            </h2>
                            <p className="text-white/80 text-lg">
                              {currentProfileUser.age} anos
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="gradient-mystical text-white border-0 mb-2">
                              {currentProfileUser.race}
                            </Badge>
                            {currentProfileUser.family && (
                              <Badge variant="outline" className="border-white/30 text-white/90 block">
                                {currentProfileUser.family}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-white/90 text-sm leading-relaxed">
                          {currentProfileUser.about}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Modern Action buttons */}
            <div className="flex justify-center gap-8 mb-6">
              <Button
                variant="destructive"
                size="lg"
                onClick={handlePass}
                className="rounded-full h-16 w-16 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <X className="h-7 w-7" />
              </Button>
              
              <Button
                variant="celestial"
                size="lg"
                onClick={handleSuperLike}
                className="rounded-full h-20 w-20 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 relative"
              >
                <Star className="h-8 w-8" />
                <div className="absolute inset-0 rounded-full animate-ping bg-celestial/30"></div>
              </Button>
              
              <Button
                variant="mystical"
                size="lg"
                onClick={handleLike}
                className="rounded-full h-16 w-16 p-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <Heart className="h-7 w-7" />
              </Button>
            </div>

            {/* Modern Instructions */}
            <div className="text-center glass-card rounded-2xl p-4 border-border/30">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">❌</span> Passar • 
                <span className="text-celestial"> ⭐</span> Super Like • 
                <span className="text-mystical"> ❤️</span> Curtir
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SupernaturalApp;