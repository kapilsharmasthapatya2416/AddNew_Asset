export default async function BasicInfoPage(): Promise<React.ReactElement> {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
      <p className="text-gray-600 mb-6">
        Please provide the basic information about the asset you want to add.
      </p>
      {/* Form fields for basic information would go here */}
    </div>
    );
}