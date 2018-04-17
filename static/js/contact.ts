export module contact {
  $(document).ready(function() {
    const fullAddress = window.location.href;
    const currentLocation = fullAddress.substring(fullAddress.lastIndexOf('/'));
    const success = "/contact?success=true";
    const error = "/contact?error=failed-to-send-email";
    if (currentLocation == success){
      $("#success").removeClass("hidden");
    }
    if (currentLocation == error){
      $("#error").removeClass("hidden");
    }
  });
}
