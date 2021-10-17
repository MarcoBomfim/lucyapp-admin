<template>
	<div>Login</div>
	<div class="buttons">
	      <!-- Check that the SDK client is not currently loading before accessing is methods -->
	      <div v-if="!$auth.loading">
	        <!-- show login when not authenticated -->
	        <a v-if="!$auth.isAuthenticated" @click="login" class="button is-dark"
	          ><strong>Sign in</strong></a
	        >
	        <!-- show logout when authenticated -->
	        <a v-if="$auth.isAuthenticated" @click="logout" class="button is-dark"
	          ><strong>Log out</strong></a
	        >
	      </div>
    </div>
</template>

<script type="text/javascript">
	// Create a new instance of the SDK client using members of the given options object
	this.auth0Client = await createAuth0Client({
	  domain: options.domain,
	  client_id: options.clientId,
	  audience: options.audience,
	  redirect_uri: redirectUri,
	});
</script>