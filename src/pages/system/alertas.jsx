import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { File, ListFilter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function Alertas() {
  const [t] = useTranslation("global");

  // Estados separados para las fechas
  const [dateCreate, setDateCreate] = useState();
  const [dateTracking, setDateTracking] = useState();

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-gray-500"; // Gris
      case "in_progress":
        return "bg-purple-500"; // Morado
      case "in_review":
        return "bg-orange-500"; // Naranja
      case "resolved":
        return "bg-green-500"; // Verde
      case "severe":
        return "bg-red-500"; // Rojo
      case "moderate":
        return "bg-orange-500"; // Naranja
      case "mild":
        return "bg-green-500"; // Verde
      default:
        return "bg-transparent";
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8">
        <img
          alt="GuateCare"
          src="/public/img/alertas.png"
          className="w-48 md:w-96 object-cover mb-4"
        />

        <Card className="max-w-md mb-4">
          <CardHeader>
            <CardTitle className="text-3xl">
              {t("dashboard.alertas.title")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.alertas.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Selector de fecha de creación */}
              <div className="space-y-2">
                <Label htmlFor="input-1" className="block">
                  {t("dashboard.alertas.datecreate")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-auto justify-start text-left font-normal",
                        !dateCreate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateCreate ? (
                        format(dateCreate, "dd-MM-yyyy")
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateCreate}
                      onSelect={setDateCreate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selector de prioridad */}
              <div className="space-y-2">
                <Label htmlFor="select-4" className="block">
                  {t("dashboard.alertas.priority")}
                </Label>
                <Select>
                  <SelectTrigger className="w-auto ml-2">
                    <SelectValue
                      placeholder={t("dashboard.alertas.prioritysdesc")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">
                      {t("dashboard.alertas.prioritys.mild")}
                    </SelectItem>
                    <SelectItem value="moderate">
                      {t("dashboard.alertas.prioritys.moderate")}
                    </SelectItem>
                    <SelectItem value="severe">
                      {t("dashboard.alertas.prioritys.severe")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de fecha de seguimiento */}
              <div className="space-y-2">
                <Label htmlFor="input-1" className="block">
                  {t("dashboard.alertas.datetracking")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-auto justify-start text-left font-normal",
                        !dateTracking && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTracking ? (
                        format(dateTracking, "dd-MM-yyyy")
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTracking}
                      onSelect={setDateTracking}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selector de estado */}
              <div className="space-y-2">
                <Label htmlFor="select-4" className="block">
                  {t("dashboard.alertas.status")}
                </Label>
                <Select>
                  <SelectTrigger className="w-auto ml-2">
                    <SelectValue
                      placeholder={t("dashboard.alertas.statusdesc")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">
                      {t("dashboard.alertas.statuss.new")}
                    </SelectItem>
                    <SelectItem value="in_progress">
                      {t("dashboard.alertas.statuss.in_progress")}
                    </SelectItem>
                    <SelectItem value="in_review">
                      {t("dashboard.alertas.statuss.in_review")}
                    </SelectItem>
                    <SelectItem value="resolved">
                      {t("dashboard.alertas.statuss.resolved")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input para nombre */}
              <div className="space-y-2">
                <Label htmlFor="input-1" className="block">
                  {t("dashboard.alertas.desc")}
                </Label>
                <Input
                  id="input-1"
                  type="text"
                  name="nombre"
                  placeholder={t("dashboard.alertas.alertasdesc")}
                />
              </div>
              
              {/* Notas médicas */}
              <div className="space-y-2">
                <Label htmlFor="input-1" className="block">
                  {t("dashboard.alertas.notes")}
                </Label>
                <Textarea
                  id="input-1"
                  type="text"
                  name="nombre"
                  placeholder={t("dashboard.alertas.notasdesc")}
                />
              </div>
            </div>
            <Button className="w-full">{t("dashboard.buttons.alert")}</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week" className="py-4 w-full max-w-4xl mx-auto">
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
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                {t("home.export.title")}
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
            <CardHeader className="px-7">
              <CardTitle>{t("home.data.title")}</CardTitle>
              <CardDescription>{t("home.data.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <Table className="w-full">
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
                      <TableHead className="text-right">
                        {t("home.data.edit")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("home.data.view")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Liam Johnson",
                        status: "resolved",
                        email: "liam@example.com",
                        priority: "$250.00",
                        createdAt: "2023-06-23",
                        trackingDate: "2023-07-01",
                      },
                      {
                        name: "Emma Brown",
                        status: "severe",
                        email: "emma@example.com",
                        priority: "$300.00",
                        createdAt: "2023-07-01",
                        trackingDate: "2023-07-05",
                      },
                      {
                        name: "Olivia Smith",
                        status: "moderate",
                        email: "olivia@example.com",
                        priority: "$150.00",
                        createdAt: "2023-08-10",
                        trackingDate: "2023-08-15",
                      },
                      {
                        name: "Noah Davis",
                        status: "mild",
                        email: "noah@example.com",
                        priority: "$400.00",
                        createdAt: "2023-09-05",
                        trackingDate: "2023-09-10",
                      },
                    ].map((alert, index) => (
                      <TableRow key={index} className="bg-accent">
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-2 md:w-2 md:h-2 rounded-full mr-2 ${getStatusColor(
                                alert.status
                              )}`}
                            ></div>
                            <span className="font-medium">{alert.name}</span>
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {alert.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {index + 1}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {alert.createdAt}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {alert.trackingDate}
                        </TableCell>
                        <TableCell className="text-right">
                          {alert.priority}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-7">
                            Editar
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-7">
                            Visualizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Alertas;
