import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CreateProject.module.css';

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState({
    orgName: '',
    projectName: '',
    projectDescription: '',
    selectedNetwork: '',
    githubRepo: '',
    entryFee: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNetworkSelect = (network: string) => {
    setFormData(prev => ({ ...prev, selectedNetwork: network }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create project</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>1 Organisation info</h2>
          <div className={styles.fileUpload}>
            <p>Organisation logo/image</p>
            <button type="button">
              <Image src="/svgs/upload.svg" alt="Upload" width={20} height={20} />
              Upload file
            </button>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="orgName">Organisation name</label>
            <input
              type="text"
              id="orgName"
              name="orgName"
              value={formData.orgName}
              onChange={handleInputChange}
              placeholder="e.g. Optimism"
            />
          </div>
        </section>
        
        <section>
          <h2>2 Project info</h2>
          <div className={styles.fileUpload}>
            <p>Project cover image</p>
            <div className={styles.dropZone}>
              <Image src="/svgs/upload.svg" alt="Upload" width={40} height={40} />
              <p>Click to upload or drag and drop</p>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="projectName">Project name</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="e.g. Fuego Nitro"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="projectDescription">Project description</label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              placeholder="A max 280-character or less description of your project (it should fit in a tweet!)"
            />
          </div>
          <div className={styles.networkSelection}>
            <p>Select Network</p>
            <div className={styles.networkOptions}>
              {['Flux', 'Optimism', 'Base', 'World Chain'].map((network) => (
                <button
                  key={network}
                  type="button"
                  onClick={() => handleNetworkSelect(network)}
                  className={formData.selectedNetwork === network ? styles.selected : ''}
                >
                  <Image src={`/svgs/${network.toLowerCase()}-logo.svg`} alt={network} width={20} height={20} />
                  {network}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="githubRepo">GitHub repository or a link to the source code (must be public)</label>
            <input
              type="text"
              id="githubRepo"
              name="githubRepo"
              value={formData.githubRepo}
              onChange={handleInputChange}
              placeholder="e.g. https://github.com/optimism/ethereum-optimism"
            />
          </div>
        </section>
        
        <section>
          <h2>3 Project participation rules</h2>
          <div className={styles.switchGroup}>
            <label htmlFor="entryFee">Entry fee</label>
            <input
              type="checkbox"
              id="entryFee"
              name="entryFee"
              checked={formData.entryFee}
              onChange={(e) => setFormData(prev => ({ ...prev, entryFee: e.target.checked }))}
            />
          </div>
          <button type="button" className={styles.deployButton}>
            Deploy your project membership contract with Thirdweb
          </button>
        </section>
        
        <button type="submit" className={styles.submitButton}>Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;