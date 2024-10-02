import { useEffect } from "react";


//Recharts
import {

  Bar,
  BarChart,
  CartesianGrid,
  Label,

  Line,
  LineChart,

  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {

  File,

  ListFilter,

} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useTranslation } from "react-i18next";

export default function DashboardI() {
  const [t] = useTranslation("global");
  //Time
  const value = 2160;
  
  useEffect(() => {
    document.title = `${t("navbar.stadistics")} | GuateCare`;
  }, [t]);

  return (
    <>
      <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="flex justify-center items-center">
            <Card
              x-chunk="dashboard-05-chunk-1"
              className="lg:w-1/2 xl:w-3/6 2xl:w-5/6 h-auto"
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card1.text1")}
                </CardDescription>
                <CardTitle className="text-4xl">
                  150 {t("home.card1.text3")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("home.card1.text2")} 50
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card2.text1")}
                </CardDescription>
                <CardTitle className="text-4xl">
                  90 {t("home.card2.text3")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("home.card2.text2")} 30
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={25} aria-label="25% increase" /> */}
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card3.text1")}
                </CardDescription>
                <CardTitle className="text-4xl">
                  85 {t("home.card3.text3")}{" "}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("home.card3.text2")}30 {t("home.card3.text3")}
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={25} aria-label="25% increase" /> */}
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card4.text1")}
                </CardDescription>
                <CardTitle className="text-4xl">
                  80 {t("home.card4.text3")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("home.card4.text2")}90 {t("home.card4.text3")}
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={25} aria-label="25% increase" /> */}
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card5.text1")}
                </CardDescription>
                <CardTitle className="text-4xl">
                  75 {t("home.card5.text3")}
                  <sup>2</sup>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("home.card5.text2")} 60 {t("home.card5.text3")}
                  <sup>2</sup>
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={12} aria-label="12% increase" /> */}
              </CardFooter>
            </Card>
          </div>
          {/* Charts */}
          <div className="grid flex-1 items-center gap-2 p-2 sm:px-6 sm:py-0 md:gap-2 lg:grid-cols-2 xl:grid-cols-3">
            <Card
              className="flex flex-col lg:max-w-md"
              x-chunk="charts-01-chunk-1"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                <div>
                  <CardDescription>Resting HR</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    62
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      bpm
                    </span>
                  </CardTitle>
                </div>
                <div>
                  <CardDescription>Variability</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    35
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      ms
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 items-center">
                <ChartContainer
                  config={{
                    resting: {
                      label: "Resting",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full"
                >
                  <LineChart
                    accessibilityLayer
                    margin={{
                      left: 14,
                      right: 14,
                      top: 10,
                    }}
                    data={[
                      {
                        date: "2024-01-01",
                        resting: 62,
                      },
                      {
                        date: "2024-01-02",
                        resting: 72,
                      },
                      {
                        date: "2024-01-03",
                        resting: 35,
                      },
                      {
                        date: "2024-01-04",
                        resting: 62,
                      },
                      {
                        date: "2024-01-05",
                        resting: 52,
                      },
                      {
                        date: "2024-01-06",
                        resting: 62,
                      },
                      {
                        date: "2024-01-07",
                        resting: 70,
                      },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="hsl(var(--muted-foreground))"
                      strokeOpacity={0.5}
                    />
                    <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                      }}
                    />
                    <Line
                      dataKey="resting"
                      type="natural"
                      fill="var(--color-resting)"
                      stroke="var(--color-resting)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        fill: "var(--color-resting)",
                        stroke: "var(--color-resting)",
                        r: 4,
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          }}
                        />
                      }
                      cursor={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            {/* Chart 2 */}
            <Card
              className="flex flex-col lg:max-w-md"
              x-chunk="charts-01-chunk-1"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                <div>
                  <CardDescription>Resting HR</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    62
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      bpm
                    </span>
                  </CardTitle>
                </div>
                <div>
                  <CardDescription>Variability</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    35
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      ms
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 items-center">
                <ChartContainer
                  config={{
                    resting: {
                      label: "Resting",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full"
                >
                  <LineChart
                    accessibilityLayer
                    margin={{
                      left: 14,
                      right: 14,
                      top: 10,
                    }}
                    data={[
                      {
                        date: "2024-01-01",
                        resting: 26,
                      },
                      {
                        date: "2024-01-02",
                        resting: 72,
                      },
                      {
                        date: "2024-01-03",
                        resting: 35,
                      },
                      {
                        date: "2024-01-04",
                        resting: 62,
                      },
                      {
                        date: "2024-01-05",
                        resting: 52,
                      },
                      {
                        date: "2024-01-06",
                        resting: 62,
                      },
                      {
                        date: "2024-01-07",
                        resting: 70,
                      },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="hsl(var(--muted-foreground))"
                      strokeOpacity={0.5}
                    />
                    <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                      }}
                    />
                    <Line
                      dataKey="resting"
                      type="natural"
                      fill="var(--color-resting)"
                      stroke="var(--color-resting)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        fill: "var(--color-resting)",
                        stroke: "var(--color-resting)",
                        r: 4,
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          }}
                        />
                      }
                      cursor={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            {/* Chart 3 */}
            <Card
              className="flex flex-col lg:max-w-md"
              x-chunk="charts-01-chunk-1"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                <div>
                  <CardDescription>Resting HR</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    62
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      bpm
                    </span>
                  </CardTitle>
                </div>
                <div>
                  <CardDescription>Variability</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    35
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      ms
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 items-center">
                <ChartContainer
                  config={{
                    resting: {
                      label: "Resting",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full"
                >
                  <LineChart
                    accessibilityLayer
                    margin={{
                      left: 14,
                      right: 14,
                      top: 10,
                    }}
                    data={[
                      {
                        date: "2024-01-01",
                        resting: 62,
                      },
                      {
                        date: "2024-01-02",
                        resting: 72,
                      },
                      {
                        date: "2024-01-03",
                        resting: 35,
                      },
                      {
                        date: "2024-01-04",
                        resting: 62,
                      },
                      {
                        date: "2024-01-05",
                        resting: 52,
                      },
                      {
                        date: "2024-01-06",
                        resting: 62,
                      },
                      {
                        date: "2024-01-07",
                        resting: 70,
                      },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="hsl(var(--muted-foreground))"
                      strokeOpacity={0.5}
                    />
                    <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                      }}
                    />
                    <Line
                      dataKey="resting"
                      type="natural"
                      fill="var(--color-resting)"
                      stroke="var(--color-resting)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        fill: "var(--color-resting)",
                        stroke: "var(--color-resting)",
                        r: 4,
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          }}
                        />
                      }
                      cursor={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          {/* DATA */}
          <Tabs defaultValue="week">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="week">{t("home.dates.week")}</TabsTrigger>
                <TabsTrigger value="month">{t("home.dates.month")}</TabsTrigger>
                <TabsTrigger value="year">{t("home.dates.year")}</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">
                        {t("home.filter.title")}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {t("home.filter.filterby")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      {t("home.filter.status")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      {t("home.filter.priority")}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">
                    {t("home.export.title")}
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>{t("home.data.title")}</CardTitle>
                  <CardDescription>
                    {t("home.data.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("home.data.status")}</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t("home.data.id")}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t("home.data.create")}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t("home.data.follow")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("home.data.priority")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-accent">
                        <TableCell>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <div className="flex justify-center items-center my-10">
        <Card
          x-chunk="charts-01-chunk-0"
          className="w-96 lg:w-1/2 xl:w-3/6 2xl:w-5/6 h-auto"
        >
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>{t("home.charts.text4")}</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {value <= 60
                ? `${value} ${t("home.charts.text5")}`
                : value > 60 && value <= 1440
                ? `${Math.floor(value / 60)} ${t("home.charts.text6")}`
                : value > 1440 && value <= 2880
                ? `${Math.floor(value / 1440)} ${t("home.charts.text7")}`
                : `${Math.floor(value / 1440)} ${t("home.charts.text8")}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                steps: {
                  label: "Steps",
                  color: "hsl(var(--chart-6))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    steps: 40,
                  },
                  {
                    date: "2024-01-02",
                    steps: 2100,
                  },
                  {
                    date: "2024-01-03",
                    steps: 2200,
                  },
                  {
                    date: "2024-01-04",
                    steps: 1300,
                  },
                  {
                    date: "2024-01-05",
                    steps: 1400,
                  },
                  {
                    date: "2024-01-06",
                    steps: 2500,
                  },
                  {
                    date: "2024-01-07",
                    steps: 1600,
                  },
                ]}
              >
                <Bar
                  dataKey="steps"
                  fill="var(--color-steps)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={1200}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Average Steps"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="12,343"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-center gap-1">
            <CardDescription>{t("home.charts.text9")}</CardDescription>
            <CardDescription className="text-center">{t("home.charts.text10")}</CardDescription>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
