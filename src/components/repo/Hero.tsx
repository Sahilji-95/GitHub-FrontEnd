import React, { useState } from "react";
import Navbar from "./Navbar";
import CreateRepo, { type RepositoryFormData } from "./CreateRepo";

const Hero: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const createRepository = (repository: RepositoryFormData) => {
    console.log("Creating repository:", repository);
  };

  return (
    <>
      <Navbar onCreateRepository={() => setIsFormOpen(true)} />

      <CreateRepo
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={createRepository}
      />
    </>
  );
};

export default Hero;
