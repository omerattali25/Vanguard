import ControlPanelCard from "@/components/atoms/control-panel/control-panel-card";

export default function Home() {
  return (
    <div className=" w-full min-h-screen p-8 bg-muted/40">

      <h1 className="text-3xl font-bold text-center mb-10">
        מערכת Vanguard - לוח בקרה
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

        <ControlPanelCard title="מטופלים" description="צפייה בכל המטופלים והסטטוסים שלהם" buttonText="מעבר למטופלים" navigateTo="/patients" />
        <ControlPanelCard title="מכונות" description="צפייה בכל המכונות ועריכתן" buttonText="מעבר למכונות" navigateTo="/machines" />
        <ControlPanelCard title="אנליטיקות" description="צפייה בכל אירועי המערכות" buttonText="מעבר לאנליטיקות" navigateTo="/analytics" />

      </div>
    </div>
  );
}