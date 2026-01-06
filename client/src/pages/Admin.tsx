import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';

// Stat card component
function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [days, setDays] = useState(30);

  // Fetch analytics summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/admin/analytics/summary', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/summary?days=${days}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json();
    },
  });

  // Fetch daily stats
  const { data: dailyData } = useQuery({
    queryKey: ['/api/admin/analytics/daily', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/daily?days=${days}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch daily data');
      return res.json();
    },
  });

  // Fetch geo data
  const { data: geoData } = useQuery({
    queryKey: ['/api/admin/analytics/geo', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/geo?days=${days}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch geo data');
      return res.json();
    },
  });

  // Fetch click data
  const { data: clickData } = useQuery({
    queryKey: ['/api/admin/analytics/clicks', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/clicks?days=${days}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch click data');
      return res.json();
    },
  });

  // Fetch conversations
  const { data: conversationsData } = useQuery({
    queryKey: ['/api/admin/analytics/conversations'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics/conversations?limit=50', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    },
  });

  // State for selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  // Fetch conversation messages
  const { data: conversationMessages } = useQuery({
    queryKey: ['/api/admin/analytics/conversations', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return null;
      const res = await fetch(`/api/admin/analytics/conversations/${selectedConversationId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch conversation');
      return res.json();
    },
    enabled: !!selectedConversationId,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.displayName}</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Time range selector */}
        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d} days
            </Button>
          ))}
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Visits"
            value={summaryLoading ? '...' : summary?.visits?.total || 0}
            description={`Last ${days} days`}
          />
          <StatCard
            title="Unique Visitors"
            value={summaryLoading ? '...' : summary?.visits?.uniqueVisitors || 0}
            description={`Last ${days} days`}
          />
          <StatCard
            title="Link Clicks"
            value={summaryLoading ? '...' : summary?.clicks?.total || 0}
            description={`Last ${days} days`}
          />
          <StatCard
            title="Chat Conversations"
            value={summaryLoading ? '...' : summary?.chat?.conversations || 0}
            description={`${summary?.chat?.messages || 0} total messages`}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="visitors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* Visitors Tab */}
          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData?.dailyVisits && dailyData.dailyVisits.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={dailyData.dailyVisits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="visits"
                        stroke="#3b82f6"
                        fill="#3b82f680"
                        name="Visits"
                      />
                      <Area
                        type="monotone"
                        dataKey="uniqueVisitors"
                        stroke="#10b981"
                        fill="#10b98180"
                        name="Unique Visitors"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No visitor data yet. Data will appear once visitors start coming.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geography Tab */}
          <TabsContent value="geography">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  {geoData?.byCountry && geoData.byCountry.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={geoData.byCountry.slice(0, 10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="country" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="visitCount" fill="#3b82f6" name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No geographic data yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  {geoData?.byCity && geoData.byCity.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>City</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Visits</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {geoData.byCity.slice(0, 10).map((row: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{row.city || 'Unknown'}</TableCell>
                            <TableCell>{row.country || 'Unknown'}</TableCell>
                            <TableCell className="text-right">{row.visitCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No city data yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Click Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {clickData?.clicksByLink && clickData.clicksByLink.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={clickData.clicksByLink}
                          dataKey="clickCount"
                          nameKey="linkLabel"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => entry.linkLabel || 'Unknown'}
                        >
                          {clickData.clicksByLink.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No click data yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Link Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {clickData?.clicksByLink && clickData.clicksByLink.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Link</TableHead>
                          <TableHead className="text-right">Clicks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clickData.clicksByLink.map((link: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="max-w-[200px] truncate">
                              {link.linkLabel || link.linkUrl}
                            </TableCell>
                            <TableCell className="text-right">{link.clickCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No click data yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Conversation list */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversationsData?.conversations && conversationsData.conversations.length > 0 ? (
                    <div className="max-h-[500px] overflow-y-auto">
                      {conversationsData.conversations.map((conv: any) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversationId(conv.id)}
                          className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                            selectedConversationId === conv.id ? 'bg-muted' : ''
                          }`}
                        >
                          <p className="font-medium text-sm">
                            {format(new Date(conv.startedAt), 'MMM d, yyyy h:mm a')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {conv.messageCount} messages
                          </p>
                          {conv.country && (
                            <p className="text-xs text-muted-foreground">
                              {conv.city ? `${conv.city}, ` : ''}{conv.country}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8 px-4">
                      No conversations yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Conversation viewer */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedConversationId ? 'Conversation Details' : 'Select a Conversation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {conversationMessages?.messages ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {conversationMessages.messages.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg max-w-[80%] ${
                            msg.role === 'user'
                              ? 'bg-blue-500 text-white ml-auto'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a conversation to view messages.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
