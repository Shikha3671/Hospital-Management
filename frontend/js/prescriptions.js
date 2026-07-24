document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const prescriptionForm = document.getElementById('prescription-form');
  const prescriptionList = document.getElementById('prescription-list');
  const messageBox = document.getElementById('message-box');

  const loadPrescriptions = async () => {
    try {
      const prescriptions = await apiRequest('/prescriptions');
      if (!prescriptionList) return;
      prescriptionList.innerHTML = '';

      if (!prescriptions.length) {
        prescriptionList.innerHTML = '<li>No prescriptions found.</li>';
        return;
      }

      prescriptions.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.medication_name}</strong> - ${item.dosage} (${item.frequency}) for ${item.duration_days} days`;
        prescriptionList.appendChild(li);
      });
    } catch (error) {
      showMessage(messageBox, error.message, 'error');
    }
  };

  if (prescriptionForm) {
    prescriptionForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        appointmentId: document.getElementById('appointment-id').value,
        doctorId: document.getElementById('doctor-id').value,
        patientId: document.getElementById('patient-id').value,
        medicationName: document.getElementById('medication-name').value,
        dosage: document.getElementById('dosage').value,
        frequency: document.getElementById('frequency').value,
        durationDays: document.getElementById('duration-days').value,
        instructions: document.getElementById('instructions').value
      };

      try {
        await apiRequest('/prescriptions', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showMessage(messageBox, 'Prescription created successfully', 'success');
        prescriptionForm.reset();
        loadPrescriptions();
      } catch (error) {
        showMessage(messageBox, error.message, 'error');
      }
    });
  }

  loadPrescriptions();
});
