import React from 'react'

function Test() {
  return (
    <>
    <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-2">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="flex justify-center items-center">
          <Card className="lg:w-1/2 xl:w-auto 2xl:w-5/6 h-auto">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg">
                {t("home.card1.text1")}
              </CardDescription>
              <CardTitle className="flex items-center">
                <span className="text-red-500 text-6xl font-bold">
                  {activeAlerts}
                </span>{" "}
                <span className="ml-4">
                  {activeAlerts === 1
                    ? t("home.card1.text4") // Caso cuando hay 1 alerta
                    : t("home.card1.text3")}{" "}
                  {/* Casos cuando hay más de 1 alerta */}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts > 0 && (
                <div className="mt-2 text-lg font-semibold text-red-600 flex items-center">
                  <span className="mr-2">🚨</span>
                  {activeAlerts > 10
                    ? t("home.card1.criticalAlert")
                    : t("home.card1.warningAlert")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {/* Tarjeta para mostrar la cantidad de niños registrados este mes */}
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg">
                {t("home.card2.text1")}
              </CardDescription>
              <CardTitle className="text-4xl">
                <span className="text-blue-500">{maleCountThisMonth}</span>{" "}
                {t("home.card2.text2")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md text-muted-foreground">
                {t("home.card2.text3")}{" "}
                <span className="text-blue-500">{maleCountLastMonth}</span>{" "}
                {t("home.card2.text2")}
              </div>
            </CardContent>
            <CardFooter>
              {/* Puedes agregar un progreso si lo deseas */}
            </CardFooter>
          </Card>

          {/* Tarjeta para mostrar la cantidad de niñas registradas este mes */}
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg">
                {t("home.card3.text1")}
              </CardDescription>
              <CardTitle className="text-4xl">
                <span className="text-pink-500">{femaleCountThisMonth}</span>{" "}
                {t("home.card3.text2")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md text-muted-foreground">
                {t("home.card3.text3")}{" "}
                <span className="text-pink-500">{maleCountLastMonth}</span>{" "}
                {t("home.card3.text2")}
              </div>
            </CardContent>
            <CardFooter>
              {/* Puedes agregar un progreso si lo deseas */}
            </CardFooter>
          </Card>
          {/* Tarjeta para mostrar la cantidad de mediciones este mes */}
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg">
                {t("home.card4.text1")}
              </CardDescription>
              <CardTitle className="text-4xl">
                <span className="text-blue-500">
                  {measurementsCountThisMonth}
                </span>{" "}
                {t("home.card4.text2")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-md text-muted-foreground">
              {t("home.card4.text3")}{" "}
                <span className="text-blue-500">
                  {measurementsCountThisMonth}
                </span>{" "}
                {t("home.card4.text2")}
              </div> */}
              <div className="text-md text-muted-foreground">
                {t("home.card4.text4")}{" "}
                <span className="text-blue-500">
                  {measurementsCountLastMonth}
                </span>{" "}
                {t("home.card4.text2")}
              </div>
              <div className="text-md text-muted-foreground mt-2">
                {t("home.card4.text5")}{" "}
                <span className="text-blue-500">
                  {avgLengthThisMonth.toFixed(2)}
                </span>{" "}
                {t("home.card4.text6")}
              </div>
              <div className="text-md text-muted-foreground mt-2">
                {t("home.card4.text7")}{" "}
                <span className="text-blue-500">
                  {avgLengthLastMonth.toFixed(2)}
                </span>{" "}
                {t("home.card4.text6")}
              </div>
            </CardContent>
            <CardFooter>
              {/* Puedes agregar un progreso si lo deseas */}
            </CardFooter>
          </Card>
          {/* Peso */}
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg">
                {t("home.card5.text1")}
              </CardDescription>
              <CardTitle className="text-4xl">
                <span className="text-yellow-500">
                  {measurementsCountThisMonth}
                </span>{" "}
                {t("home.card5.text2")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-md text-muted-foreground">
              {t("home.card5.text3")}{" "}
                <span className="text-yellow-500">
                  {measurementsCountThisMonth}
                </span>{" "}
                mediciones
              </div> */}
              <div className="text-md text-muted-foreground">
                {t("home.card5.text4")}{" "}
                <span className="text-yellow-500">
                  {measurementsCountLastMonth}
                </span>{" "}
                {t("home.card5.text2")}
              </div>
              <div className="text-md text-muted-foreground mt-2">
                {t("home.card5.text5")}{" "}
                <span className="text-yellow-500">
                  {avgWeightThisMonth.toFixed(2)}
                </span>{" "}
                {t("home.card5.text6")}
              </div>
              <div className="text-md text-muted-foreground mt-2">
                {t("home.card5.text7")}{" "}
                <span className="text-yellow-500">
                  {avgWeightLastMonth.toFixed(2)}
                </span>{" "}
                {t("home.card5.text6")}
              </div>
            </CardContent>
            <CardFooter>
              {/* Puedes agregar un progreso si lo deseas */}
            </CardFooter>
          </Card>
        </div>
        <div className="grid gap-4 md:items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="flex flex-col shadow-lg">
            <CardHeader className="items-center pb-2">
              <CardTitle className="text-lg sm:text-xl md:text-2xl">
                {t("home.charts.text1")}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t("home.charts.text2")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              {data4.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                >
                  <PieChart width={300} height={300}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={data4}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      innerRadius="40%"
                      strokeWidth={4}
                    >
                      {data4.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="text-center text-gray-500">Cargando datos...</p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              {data4.length > 0 && (
                <div className="font-medium text-base sm:text-lg">
                  <strong>{t("home.charts.text3")}</strong>{" "}
                  {maxCommunity.name}
                  <div>
                    <strong>{t("home.charts.text4")}</strong>{" "}
                    {maxCommunity.value}
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
          {/* Chart 2 */}
          <AlertaGrafico />
          {/* Chart 3 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("home.charts.text7")}</CardTitle>
              <CardDescription>{t("home.charts.text8")}</CardDescription>
            </CardHeader>
            <CardContent>
              {data3.length > 0 ? (
                <ChartContainer config={chartConfig2}>
                  <BarChart
                    data={data3}
                    width={500}
                    height={300}
                    accessibilityLayer
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="monthYear"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        chartConfig2[value] ? chartConfig2[value] : value
                      }
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="reportes"
                      strokeWidth={2}
                      radius={8}
                      activeIndex={2}
                      activeBar={({ ...props }) => {
                        return (
                          <Rectangle
                            {...props}
                            fillOpacity={0.8}
                            stroke={props.payload.fill}
                            strokeDasharray={4}
                            strokeDashoffset={4}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p>Cargando datos...</p> // Aquí puedes usar un spinner si lo prefieres
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 ">
              <span>{t("home.charts.text9")}</span>
              <span className="text-lg font-bold ml-2">
                {" "}
                {data3.length > 0
                  ? data3.reduce((total, item) => total + item.reportes, 0)
                  : 0}
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
    <div className="justify-center items-center">
      <DataTable />
    </div>

    {/* <TiemRaspberry /> */}

    {/* <DataTable /> */}
    <div className="flex justify-center items-center my-10"></div>
  </>
  )
}

export default Test