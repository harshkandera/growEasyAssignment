
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, removeToken, isAuthenticated } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, ClipboardList, ArrowLeft, LogOut } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
  todo_count: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setProfile(data);
    } catch (err: any) {
      if (err.message.includes('Could not validate credentials')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl p-6">
        <Card>
          <CardHeader className="text-center p-10 pb-8">
            <div className="flex justify-center mb-6">
              <Avatar className="h-28 w-28 border-4 border-border">
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-bold">{profile.name}</CardTitle>
            <CardDescription className="text-base mt-2">{profile.email}</CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <Separator className="mb-8" />

            {/* Stats Grid */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-5 p-5 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">User ID</p>
                  <p className="text-xl font-semibold">#{profile.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 transition-colors">
                <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="text-xl font-semibold">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 rounded-lg bg-green-500/10 hover:bg-green-500/15 transition-colors">
                <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Todos</p>
                  <p className="text-xl font-semibold">
                    {profile.todo_count} {profile.todo_count === 1 ? 'Task' : 'Tasks'}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1 h-11"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-11"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}