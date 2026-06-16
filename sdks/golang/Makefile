init:
	go mod init abdm_client
	go get github.com/microsoft/kiota-abstractions-go
	go get github.com/microsoft/kiota-http-go
	go get github.com/microsoft/kiota-serialization-form-go
	go get github.com/microsoft/kiota-serialization-json-go
	go get github.com/microsoft/kiota-serialization-text-go
	go get github.com/microsoft/kiota-serialization-multipart-go

gen:
	kiota generate -l go -c AbdmClient -n abdm_client/client -d api-reference/user-app/abdm-connect/registration.yml -o ./client