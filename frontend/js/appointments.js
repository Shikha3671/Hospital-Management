document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const appointmentForm = document.getElementById('appointment-form');
  const appointmentList = document.getElementById('appointment-list');
  const messageBox = document.getElementById('message-box');

  const loadAppointments = async () => {
    try {
      const appointments = await apiRequest('/appointments');
      if (!appointmentList) return;
      appointmentList.innerHTML = '';

      if (!appointments.length) {
        appointmentList.innerHTML = '<li>No appointments found.</li>';
        return;
      }

      appointments.forEach((appointment) => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${appointment.patient_first_name} ${appointment.patient_last_name}</strong> - ${appointment.appointment_date} ${appointment.appointment_time} (${appointment.status})`;
        appointmentList.appendChild(item);
      });
    } catch (error) {
      showMessage(messageBox, error.message, 'error');
    }
  };

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        patientId: document.getElementById('patient-id').value,
        doctorId: document.getElementById('doctor-id').value,
        departmentId: document.getElementById('department-id').value,
        appointmentDate: document.getElementById('appointment-date').value,
        appointmentTime: document.getElementById('appointment-time').value,
        status: 'scheduled',
        notes: document.getElementById('appointment-notes').value
      };

      try {
        await apiRequest('/appointments', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showMessage(messageBox, 'Appointment booked successfully', 'success');
        appointmentForm.reset();
        loadAppointments();
      } catch (error) {
        showMessage(messageBox, error.message, 'error');
      }
    });
  }

  loadAppointments();
});
