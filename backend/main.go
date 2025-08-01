package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

/**
* @Description
* Lambda handler
 */
func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Printf("Processing request with ID: %s", request.RequestContext.RequestID)

	response := "Hello visitor"

	if request.PathParameters != nil {
		userName := request.PathParameters["userName"]
		response = fmt.Sprintf("Hello  %s", userName)

	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: response,
	}, nil
}

func main() {
	lambda.Start(handler)
}
